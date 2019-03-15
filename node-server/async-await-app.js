const admin = require('firebase-admin');
const request = require('request-promise-native');

const config = require('./config');

admin.initializeApp({
    credential: admin.credential.cert(config.firebase.firebaseServiceAccount),
    databaseURL: config.firebase.firebaseURL
});

const db = admin.firestore();

/**
 * Pull down all existing symbols in Firestore and update 
 * them with data from Alpha Vantage stock endpoints.
 * @param {FirebaseFirestore.Firestore} db
 * @returns {Promise<void>}
 */
async function runStockService(db) {
    try {
        console.log('Starting stock service')

        // Get all stock documents from Firestore
        const snapshot = await db.collection('stocks').get();

        // Parse out only the symbol field from each document
        const symbols = await snapshot.docs.map(doc => doc.id);

        // Structure requests for each symbol
        const requests = symbols.map(symbol => request.get({
            url: config.alphaVantage.stockURL,
            qs: {
                function: 'GLOBAL_QUOTE',
                symbol: symbol,
                datatype: 'json',
                apikey: config.alphaVantage.stockAPIKey
            },
            json: true
        }))

        // Get stock quotes from Alpha Vantage
        const stockQuotes = await Promise.all(requests);

        // Get the quote objects from the response body
        const quotes = stockQuotes.map(stockQuote => stockQuote["Global Quote"]);

        // Parse out the information we want from the quote objects
        const firebaseUpdates = quotes.map(quote => {
            documentName = quote['01. symbol'];
            documentFields = {
                symbol: documentName,
                price: quote['05. price'],
                change: quote['09. change'],
                percentChange: quote['10. change percent']
            };

            // Update call to Firebase
            return db.collection('stocks').doc(documentName).set(documentFields);
        });

        // Wait for updates to Firebase to complete
        const writeResults = await Promise.all(firebaseUpdates);

        console.log(`Updated ${writeResults.length} stocks!`)

        // Restart service after 1 min (1000ms * 60)
        setTimeout(() => {
            runStockService(db);
        }, 1000 * 60)
    } catch (err) {
        console.error(err);
    }
}

runStockService(db)

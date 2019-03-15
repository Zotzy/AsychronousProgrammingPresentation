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
function runStockService(db) {
    return Promise.resolve().then(() => {
        console.log('Starting stock service')

        // Get all stock documents from Firestore
        return db.collection('stocks').get();
    }).then(snapshot => {
        // Parse out only the symbol field from each document
        return snapshot.docs.map(doc => doc.id);
    }).then(symbols => {
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
        return Promise.all(requests);
    }).then(stockQuotes => {
        // Get the quote objects from the response body
        const quotes = stockQuotes.map(stockQuote => stockQuote["Global Quote"]);

        // Parse out the information we want from the quote objects
        const firebaseUpdates = quotes.map(quote => {
            documentName = quote['01. symbol'];
            documentFields = {
                symbol: documentName,
                price: quote['05. price'],
                change: quote['09. change'],
                percentChange: quote['10. change percent'].replace('%', '')
            };

            // Update call to Firebase
            return db.collection('stocks').doc(documentName).set(documentFields);
        });

        // Wait for updates to Firebase to complete
        return Promise.all(firebaseUpdates);
    }).then(writeResults => {
        console.log(`Updated ${writeResults.length} stocks!`)
        
        // Restart service after 1 min (1000ms * 60)
        setTimeout(() => {
            runStockService(db);
        }, 1000 * 60)
    }).catch(err => {
        console.error(err);
    });
}

runStockService(db)

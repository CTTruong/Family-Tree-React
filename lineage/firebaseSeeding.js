
const admin = require('./node_modules/firebase-admin');
const serviceAccount = require("./service-key.json");

const data = require("./data.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lineage-5398e.firebaseio.com"
});

data && Object.keys(data).forEach((key,index1) => {
    const nestedContent = data[key];
    if (typeof nestedContent === "object") {
        admin.database().ref(key).once('value').then(function(snapshot) {
            if(!snapshot.val()){
                Object.keys(nestedContent).forEach((docTitle,index2) => {
                    admin.database()
                        .ref(key)
                        .push(nestedContent[docTitle])
                        .then((res) => {
                            console.log("Document successfully written!");
                            if(index1+1 == Object.keys(data).length && index2+1 == Object.keys(nestedContent).length ){
                                console.warn(`All data added. Now exiting.`);
                                process.exit();
                            }
                        })
                        .catch((error) => {
                            console.error("Error writing document: ", error);
                        });
                });
            }else{
                console.warn(`Warning : Data \`${key}\` already present in firebase. To add this data first remove it.`);
                if(index1+1 == Object.keys(data).length ){
                    console.warn(`Now exiting.`);
                    process.exit();
                }
            }
          });
        
    }
});
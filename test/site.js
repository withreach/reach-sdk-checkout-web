var merchantId = '18da9ea3-f9ac-4e64-8405-d301f079a658';
var fingerprint = '5b421716-5117-41c5-93a8-e5b300c8496a';
var transaction = '6e2e1b26-7b34-43e6-b240-b2c7cb85748f';

rch.requirements(merchantId, { Currency: 'EUR',
                               DeviceFingerprint: fingerprint })
.then(function(result) {
  console.log('requirements success: ' + JSON.stringify(result));
  return rch.challenge("https://checkout-dev.rch.io/challenge/" + transaction, 
                       "03", document.getElementById("container"));
})
.then(function(result) {
  console.log("challenge done: " + JSON.stringify(result))
})
.catch(function(error) {
  console.log('failure: ' + error);
});

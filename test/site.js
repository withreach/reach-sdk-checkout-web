var merchantId = '18da9ea3-f9ac-4e64-8405-d301f079a658';
var fingerprint = '5b421716-5117-41c5-93a8-e5b300c8496a';


rch.requirements(merchantId, { Currency: 'EUR',
                               DeviceFingerprint: fingerprint })
.then(function(result) {
  console.log('requirements success: ' + JSON.stringify(result));
})
.catch(function(error) {
  console.log('requirements failure: ' + error);
});


rch.challenge("https://checkout.rch.red/challenge/95189a69-defd-48e3-997a-6f8dca8d16d8", 
              "03", document.getElementById("container"))
.then(function(result) {
  console.log("challenge done: " + JSON.stringify(result))
})
.catch(function(error) {
  console.log('challenge failure: ' + error);
});

rch.requirements(merchantId, { Currency: 'EUR',
                               DeviceFingerprint: fingerprint })

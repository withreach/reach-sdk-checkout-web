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

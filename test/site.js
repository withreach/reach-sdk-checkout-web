var merchantId = '18da9ea3-f9ac-4e64-8405-d301f079a658';
var transaction = '6e2e1b26-7b34-43e6-b240-b2c7cb85748f';

console.log('requirements success: ' + JSON.stringify(result));
rch.challenge("https://engine-dev.gointerpay.net/challenge/" + transaction, 
              "03", document.getElementById("container"), function (result) {
  console.log("result: " + JSON.stringify(result))
});

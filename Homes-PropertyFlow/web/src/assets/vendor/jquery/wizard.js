// $(document).ready(function(){
//     $('#btnSetupModal').click();
// })

// var wizardFunctionObject = (function() {
//     return {
//       openWizard: function() {
//         //$('#btnSetupModal').click();
//         alert("hi")
//       }
//     }
//   })(wizardFunctionObject||{})

function OpenSetupWizard(){
  $('.popup-wrap').fadeOut(500);
  $('.popup-box').removeClass('transform-in').addClass('transform-out');
  $('#btnSetupModal').click();
}

function SetupWizardNext(){
    alert("test")
}
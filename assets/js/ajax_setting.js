  

setInterval(Ajax_Html_Google , 10000 );

$(document).ready(function () {

  Ajax_Html_Google();
  Ajax_Html_Activity();
});

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'TWD',
  minimumFractionDigits: 0,
});

    function Ajax_Html_Google(){
      $.ajax({
        url:"https://script.google.com/macros/s/AKfycbwnCLdLBvFO3uIbyIOFl7EYYNanMDZPgk0YkpMoBSaTiCdCLWmP27iaFhWSYqtJr7vH/exec",
        method:"GET",
        success:function(result){
          // console.log(result);

          var lastName_max = String(result[0][0]);
          var lastName_max_len = lastName_max.length;
          var bid_amount_max = result[1][0];
          var nickname_max = result[2][0];
          var html_bid_amount_max = formatter.format(bid_amount_max);

          $('#Min_Bid_Amount').val(bid_amount_max);
          $('#bid_amount').attr('min', bid_amount_max);

          if (nickname_max == 2) {
            var NameCode = '';
            for (var i = 1; i < lastName_max_len; i++) {
               NameCode += '*';
            }
            lastName_max = lastName_max.substr(0,1)+NameCode;
          }else{
            lastName_max = '不顯示暱稱';
          }

          $('#html_bid_amount_max').html(html_bid_amount_max);
          $('#html_lastName_max').html(lastName_max);
          
        }
      })//end ajax
    }

    function Ajax_Html_Activity(){
      $.ajax({
        url:"https://script.google.com/macros/s/AKfycbz8GRjj4TKR-sE1CAoogEngNG5GQ4m9Rs_nzQcSdTs9na_gVfnBqUuLZa88QJjSMmZR/exec",
        method:"GET",
        // beforeSend: function(){
        //   Ajax_BlockUI();
        // },
        success:function(result){

          var result_len = result.length;
          var Activity_Title = result[1][0];
          var Activity_Content = result[1][1];

          var Event_Date_Start = result[1][2];
          var Event_Date_End = result[1][3];

          var Bidding_Title = result[1][4];
          var Bidding_Content = result[1][5];
          var Bidding_Image = result[1][6];

          $('#Html_Activity_Title').html(Activity_Title);
          $('#Html_Activity_Content').html(Activity_Content);

          $('#Html_Bidding_Title').html(Bidding_Title);
          $('#Html_Bidding_Content').html(Bidding_Content);
          $('#Html_Bidding_Image').attr('src', Bidding_Image);

          var NowDateTime = new Date();
          const formatDate = (current_datetime)=>{
              let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
              return formatted_date;
          }

          NowDateTime = formatDate(NowDateTime);

          Event_Date_Start = new Date(Event_Date_Start);
          Event_Date_Start = formatDate(Event_Date_Start);

          Event_Date_End = new Date(Event_Date_End);
          Event_Date_End = formatDate(Event_Date_End);

          // alert(NowDateTime);
          // alert(Event_Date_End);

          if (Event_Date_Start > NowDateTime) {
            $("#Html_Activity").hide();
            Swal.fire({
              icon: 'warning',
              title: '活動未開始',
            });
          }else if (Event_Date_Start <= NowDateTime || NowDateTime >= Event_Date_End) {
            $("#Html_Activity").show();
          }else{
            $("#Html_Activity").hide();
            Swal.fire({
              icon: 'warning',
              title: '活動未開始或是已結束',
            });
          }

        },
        // complete: function(data){
        //   $.unblockUI();
        // }
        
      })//end ajax
    }

function Ajax_BlockUI() {
  // $.blockUI({ 
  //   message: '<h5>Loading...</h5>',
  //   css: {
  //     border: 'none',
  //     padding: '5px',
  //     backgroundColor: '#000', 
  //     '-webkit-border-radius': '10px', 
  //     '-moz-border-radius': '10px', 
  //     opacity: 1, 
  //     color: '#fff',
  //   } 
  // }); 
}

function From_Button() {

  let lastName = $('#lastName').val();
  let email = $('#email').val();
  let bid_amount = $('#bid_amount').val();
  let nickname = $('#nickname').val();

  let Html_Date_End = $('#Html_Date_End').val();
  let Min_Bid_Amount = $('#Min_Bid_Amount').val();

  let Now_Date = new Date();
  
  const formatDate = (current_datetime)=>{
      let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
      return formatted_date;
  }

  var Now_Date_FormatDate = formatDate(Now_Date);

  // console.log(bid_amount);
  // console.log(Min_Bid_Amount);
  // console.log(lastName);
  // console.log(email);

  if (Html_Date_End && Now_Date_FormatDate > Html_Date_End ) {
    Swal.fire({
      icon: 'error',
      title: '競標時間截止!!',
    });

  }else if (lastName && email && bid_amount && Min_Bid_Amount && ( parseInt(bid_amount) > parseInt(Min_Bid_Amount) ) ) {
    $.ajax({
      url: "https://script.google.com/macros/s/AKfycbyME2zVoSnmOXkBJeC5xGXb3Mra1fkVnHhdaJyP8oLtHK0gmCUvyHdhuW0RCUvfknTD/exec",
      data: {
          "lastName": lastName,
          "email": email,
          "bid_amount": bid_amount,
          "nickname": nickname
      },
      beforeSend: function(){
          Ajax_BlockUI();
      },
      success: function(response) {
        $('#lastName').val("");
        $('#email').val("");
        $('#bid_amount').val("");

        Ajax_Html_Google();

        if(response.result == "成功"){
          Swal.fire({
            icon: 'success',
            title: '登記成功',
          })
          
        }else{
          Swal.fire({
            icon: 'error',
            title: '產生錯誤問題',
          });
        }

      },
      complete: function(data){
        $.unblockUI();
      }
    });
  }else if (parseInt(Min_Bid_Amount) > parseInt(bid_amount)) {
    Swal.fire('請輸入高於目前競標金額');
  }else{
    Swal.fire('請填寫欄位');
  }
};

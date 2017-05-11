import enUS from 'antd/lib/locale-provider/en_US';
export const translationsObject = {
  en: {
    application: {
      welcome_title: 'Welcome to Application',
      loading: 'loading ...',
      notAvailableErr: 'Not available',
      locale: enUS,
      period: 'Period',
      last_7_Days: 'Last 7 days',
      last_14_Days: 'Last 14 days',
      this_Month: 'This month',
      last_Month: 'Last month',
      custom: 'Custom',
      search: 'Search',
      export: 'Export',
      download: 'Download',
      exportDataFetchMsg: 'Please wait while we are processing your request',
      exportDataReadyMsg: 'Your exported file is ready! Please download the exported file now.',
      exportLoadingHeader: 'Exporting to .Xlsx',
      exportDownloadHeader: 'Export Completed',
      exportStatusHeader: 'Export Failed',
      close: 'Close'
    },
    titleBar:{
      title: 'Bookie',
      clock: 'Local Time %{time}'
    },
    myAccount:{
      screenName: 'myAccount_',
      home:'Home',
      my_account: 'My Account',
      deposit: 'Deposit',
      deposit_desc: 'Please send your BTC to the address' +
      ' below',
      copy: 'copy',
      withdraw: 'withdraw',
      withdraw_desc: 'Please select your amount',
      withdraw_completed: 'Withdraw Completed',
      withdraw_failed: 'Withdraw Failied',
      withdraw_completed_msg_1: 'You have successfully withdrawn ',
      withdraw_completed_msg_2: ' from your account and transferred it to your wallet.',
      send: 'send',
      send_value: 'Your Wallet Address',
      settings: 'settings',
      notifications: 'Notifications',
      time_zone: 'Choose Time Zone',
      format: 'Choose Format',
      change_password: 'Change Password',
      create_recovery_file: 'Download Password File',
      transaction_history: 'Transaction History',
      period: 'Period',
      date: 'Date',
      id: 'ID',
      time: 'Time',
      description: 'Description',
      status: 'Status',
      amount: 'Amount',
      insuffBitcoinErr: 'You do not have sufficient bitcoin to withdraw, your current account balance is ',
      enter_withdrawAmt: 'Enter amount you want to withdraw',
      enter_wallet_addr: 'Enter Wallet Address',
      UTC12:'UTC+12:00',
      UTC_12:'UTC-12:00',
      UTC11:'UTC+11:00',
      UTC_11:'UTC-11:00',
      UTC10:'UTC+10:00',
      UTC_10:'UTC-10:00',
      UTC9:'UTC+09:00',
      UTC_9:'UTC-09:00',
      UTC8:'UTC+08:00',
      UTC_8:'UTC-08:00',
      UTC7:'UTC+07:00',
      UTC_7:'UTC-07:00',
      UTC6:'UTC+06:00',
      UTC_6:'UTC-06:00',
      UTC5:'UTC+05:00',
      UTC_5:'UTC-05:00',
      UTC4:'UTC+04:00',
      UTC_4:'UTC+04:00',
      UTC3:'UTC+03:00',
      UTC_3:'UTC-03:00',
      UTC2:'UTC+02:00',
      UTC_2:'UTC-02:00',
      UTC1:'UTC+01:00',
      UTC_1:'UTC-01:00',
      UTC0:'UTC+00:00'
    },
    signup: {
      new_acc_req_text: 'Please create your new account',
      copy_text: 'Copy',
      download_rec_text: 'Save Password File',
      acc_name: 'Account Name',
      password_warning_1: 'If you lose your password, you will lose all of your funds!',
      password_warning_2: ' Keep your password safe!',
      password_warning_3: ' To download a text file of your password, click the save button below:',
      cannot_recover_password_warning: 'I understand that Peerplays <span class="mediumMessageInText">cannot recover my password.</span>',
      securely_saved_password_warning: 'I have securely saved my password recovery file.',
      create_account: 'Create Account',
      already_account: 'Already have an account?',
      log_in: 'Log In',
      premium_acc_text: 'This is a premium name. Please enter a regular name containing least one dash, a number or no vowels.',
      password_no_match: 'The password you entered does not match',
      field_req: 'Field is required',
      acc_name_taken: 'Account name is already taken'
    },
    login: {
      username: 'Username',
      password: 'Password',
      title: 'LOGIN',
      signup: 'SIGN UP',
      username_notfound: 'username not found',
      password_short: 'password too short',
      wrong_username_password: 'wrong username or password'
    },
    changePassword:{
      title: 'Change Your Password',
      enter_old_password: 'Enter your current password',
      enter_new_password: 'Enter your new password',
      confirm_new_password: 'Confirm your new password',
      old_password_does_not_match: 'Old password doesn\'t match',
      current_password: 'Current Password',
      new_password: 'New Password',
      confirm_password: 'Confirm Password',
      min_pwd_error: 'Password must be minimum 22 characters long',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back_to_my_account: 'Back to My Account',
      successText: 'Congratulations! You have successfully<br/>' +
      ' changed your password.'
    },
    notification: {
      deposit: 'The deposit of %{amount} %{currency} is confirmed',
      bet_resolved: 'A market you’ve bet on is ended and bets are resolved',
      software_update: 'New version available, update now',
      transaction_history_data_exported: 'Transaction History Data is exported'
    },
    welcome:{
      getting_started: 'Getting Started',
      place_bet: 'Placing a new bet',
      place_bet_desc: 'You can place a lay (against) bet by selecting the odds in the blue box. When placing a lay bet you are betting for an outcome not to happen' +
      ' - for example betting that Oakland will not beat Houston. Your bet against Oakland will therefore win if the result is either a Houston win or a draw.' +
      ' The current odds will automatically be selected' +
      ' but you can alter these to your liking.',
      start_betting_now: 'Start Betting Now'
    },
    processTransaction: {
      no_valid_signatures: 'No valid signatures',
    },
    deposit:{
      title: 'Make a Deposit',
      left_description: 'To deposit on your desktop computer or laptop, ' +
      '<span class="boldTextInMessage">copy and paste our address</span> into your wallet and' +
      ' complete the transaction.',
      right_description: 'To make a mobile deposit, open' +
      ' your Bitcoin wallet app on your smartphone or ' +
      'tablet and <span class="boldTextInMessage">scan the QR code.</span>',
      copy: 'Copy',
      continue: 'Continue',
      or: 'or'
    },
    topbar:{
      available: 'Available',
      in_game: 'In-game',
      myaccount:'My Account',
      help: 'Help & Support',
      signout: 'Sign Out'
    },
    landing:{
      login: 'Login',
      signup: 'Signup now',
      slogan: 'Slogan',
      copyright: 'Copyright',
      terms: 'Terms & Conditions'
    },
    mybets:{
      screenName: 'myBets_',
      //Days of week - first three characters
      today: 'Today',
      tomorrow: 'Tomorrow',
      sun: 'Sun',
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      total: 'TOTAL',
      event_time: 'Event Time',
      time: 'Time',
      type: 'Type',
      sport: 'Sport',
      odds: 'Odds',
      stake: 'Stake',
      profit: 'Profit',
      cancel: 'Cancel',
      cancel_all: 'Cancel All',
      home: 'home',
      mybets: 'My Bets',
      nodata: 'Sorry, no results found.',
      unmatched_bets: 'UNMATCHED BETS',
      matched_bets: 'MATCHED BETS',
      resolved_bets: 'RESOLVED BETS',
      date: 'Date',
      from: 'From',
      to: 'To'
    },
    complex_betting_widget:{
      back_all: 'Back all',
      lay_all: 'Lay all',
      offer: 'OFFER',
      matched: 'Matched',
      moneyline: 'Moneyline'
    },
    simple_betting_widget:{
      no_data: 'There is no event to be displayed.'
    },
    quick_bet_drawer: {
      header: 'BETSLIP',
      unconfirmed_bets: {
        empty: {
          instructions: 'CLICK ON THE ODDS TO ADD<br/>SELECTIONS TO THE BETSLIP',
          my_bet_button: 'VIEW YOUR BETS IN MY BETS'
        },
        confirmation: {
          instructions: 'The transaction fee of this bet is \u0243%{amount}.<br/>Are you sure you want to place this bet?',
          cancel_button: 'CANCEL',
          confirm_button: 'CONFIRM BET',
        },
        error: {
          instructions: 'Sorry, we are unable to proceed<br/>with your request. Please try again!',
          cancel_button: 'CANCEL',
          confirm_button: 'TRY AGAIN',
        },
        success: {
          instructions: 'Your bets have been successfully placed.',
        },
        content: {
          place_bet_button: 'PLACE BET \u0243%{amount}'
        }
      }
    },
    market_drawer: {
      tab1: 'BETSLIP',
      tab2: 'PLACED BETS',
      unconfirmed_bets: {
        header: 'Betslip',
        empty: {
          instructions: 'CLICK ON THE ODDS TO ADD<br/>SELECTIONS TO THE BETSLIP',
          my_bet_button: 'VIEW YOUR BETS IN MY BETS'
        },
        confirmation: {
          instructions: 'The transaction fee of this bet is \u0243%{amount}.<br/>Are you sure you want to place this bet?',
          cancel_button: 'CANCEL',
          confirm_button: 'CONFIRM BET',
        },
        error: {
          instructions: 'Sorry, we are unable to proceed<br/>with your request. Please try again!',
          cancel_button: 'CANCEL',
          confirm_button: 'TRY AGAIN',
        },
        success: {
          instructions: 'Your bets have been successfully placed.',
        },
        content: {
          place_bet_button: 'PLACE BET \u0243%{amount}'
        }
      },
      placed_bets: {
        header: 'UNMATCHED BETS',
        empty: {
          instructions: 'CLICK ON THE ODDS TO ADD<br/>SELECTIONS TO THE BETSLIP',
          my_bet_button: 'VIEW YOUR BETS IN MY BETS'
        },
        confirmation: {
          instructions: 'The transaction fee of this bet is \u0243%{amount}.<br/>Are you sure you want to place this bet?',
          cancel_button: 'CANCEL',
          confirm_button: 'CONFIRM BET',
        },
        error: {
          instructions: 'Sorry, we are unable to proceed<br/>with your request. Please try again!',
          cancel_button: 'CANCEL',
          confirm_button: 'TRY AGAIN',
        },
        success: {
          instructions: 'Your bets have been successfully updated.',
        },
      },
      unmatched_bets: {
        header: 'UNMATCHED BETS',
        content: {
          update_button: 'UPDATE \u0243%{amount}',
          reset_button: 'RESET',
        }
      }
    },
    rules_dialogue:{
      title: 'Moneyline - Rules',
      buttonTitle:'Rules',
      content: '<p>Predict the result of this match including any overtime that may be played. IN THE EVENT OF A TIE ' +
      'AFTER OVERTIME ALL BETS PLACED ON THIS MARKET WILL BE VOID. At kick off all unmatched bets will be cancelled ' +
      'and the market turned in-play, whereafter unmatched bets will not be cancelled at any time. It is the' +
      ' users own responsibility to manage their own' +
      ' positions. </p><p>Customers should be aware' +
      ' that: </br> Transmissions described as live by' +
      ' some broadcasters may actually be delayed and that all in-play ' +
      'matches are not necessarily televised.</p><p>The extent of any such delay may vary, depending on the set-up through ' +
      'which they are receiving pictures or data.</p>'
    },
    AllSports:{
      bannerText: 'In play of 100 open games',
      allSports: 'ALL SPORTS'
    },
    terms_dialogue:{
      content: '<p>BY USING THIS WEBSITE IN ANY MANNER WHATSOEVER OR BY CLICKING THE &ldquo;ACCEPT&rdquo; ICON ON OUR WEBSITE YOU ARE INDICATING ' +
      'THAT YOU ACCEPT AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS OF USE, OUR RULES AND THE PRIVACY POLICY (AS EACH MAY BE AMENDED FROM ' +
      'TIME TO TIME) WHICH, TOGETHER WITH THE TERMS OF ANY CONTRACTS ENTERED INTO BY YOU WITH OTHER MEMBERS OF MATCHBOOK (&ldquo;THIS AGREEMENT&rdquo;) ' +
      'GOVERN YOUR RELATIONSHIP ' +
      'WITH US AND WITH OTHER MEMBERS OF MATCHBOOK.</p><p>IF YOU DO NOT AGREE TO EACH AND EVERY TERM OF THIS AGREEMENT, SIMPLY EXIT FROM THE WEBSITE. ' +
      'FOR THE AVOIDANCE OF DOUBT, ' +
      'WE MAY, ' +
      'AT OUR ABSOLUTE DISCRETION, REFUSE YOUR REQUEST TO USE THE EXCHANGE.</p> <p>In consideration of our providing the Matchbook Services ' +
      'to you, you agree to all of the terms and conditions contained in this Agreement.</p> <p>Definitions &amp; Interpretation</p> ' +
      '<p>In this Agreement the following terms shall have the following meanings:</p> <p>&ldquo;this Agreement&rdquo; means these Terms and ' +
      'Conditions of Use, the Rules and Privacy Policy, collectively; &ldquo;Exchange&rdquo; means the betting exchange operated by Matchbook; ' +
      '&ldquo;Matchbook&rdquo; means Triplebet Limited, a private limited company duly incorporated with registration number 1827 with its ' +
      'registered office situated at Inchalla, Le Val, Alderney, GY9 3UL; &ldquo;We/ us/ our&rdquo; means, as appropriate, Matchbook or Matchbook&rsquo;s; ' +
      '&ldquo;MB Casino&rdquo; ' +
      'means the online casino available on the Matchbook Website; &ldquo;Matchbook Services&rdquo; mean the betting exchange services made available ' +
      'by Matchbook on the Matchbook Website; &ldquo;Matchbook Website&rdquo; or &ldquo;Website&rdquo; means the website found at www.matchbook.com, ' +
      'which is owned and operated by Matchbook, including any other similar URLs used by the desktop and mobile versions of the website; &ldquo;Member&rdquo; ' +
      'means a person who has successfully registered a user account at the Exchange; &ldquo;Rules&rdquo; mean the practical rules which must be ' +
      'followed to make a bet and the like at the Exchange; &ldquo;Privacy Policy&rdquo; means our privacy policy as it applies to your personally ' +
      'identifiable information and related aspects; &ldquo;You&rdquo; means any user of the Website or Member of the Exchange.  </p> <p>In this Agreement:</p> ' +
      '<p>words in the singular include the plural and vice versa and words in one gender include any other gender; the paragraph headings are for the sake ' +
      'of convenience only and shall not affect the interpretation of this Agreement.</p> <p>Becoming a Member of the Exchange and MB Casino</p> <p>You may ' +
      'not use the Exchange and/or MB Casino unless and until you have successfully applied for membership of the Matchbook Website. You will only be deemed ' +
      'to have successfully applied for membership of the Exchange and MB Casino once you have: applied online at the Website for membership or you have applied ' +
      'offline through one of our registration agents (not available to customers in Great Britain) or you have applied offline through one of our registration ' +
      'referrers; accepted the terms of this Agreement; and been issued by us with a member name and password We may, in our absolute discretion, refuse to accept ' +
      'your application for membership of the Exchange and MB Casino for any or no reason. We shall not be obliged to furnish you with any reasons for such refusal.' +
      '</p> <p>Trading on the Exchange</p> <p>Matchbook provides a platform upon which you can enter into various betting transactions in relation to the markets ' +
      'available on our site (&quot;Markets&quot;).</p>' +
      '<ul><p>You can enter into betting transactions either' +
      ' </p> <li>on our site (the &quot;Website Service&quot;)</li> <li>through one of our referrers</li><li>through one of our agents (not available to customers in Great o' +
      ' Britain), or</li> <li>by the Application Programs Interface (&quot;API&quot;). </li> </ul>' +
      '<p>We provide an API feed that allows clients to access the information available through our site directly via calls to the site. This enables clients ' +
      'to access the information without having to go via the URL: www.matchbook.com. Clients are free to develop their own program to use the API feed to make calls ' +
      'to the site in order to place trades.</p><p>The following use of price data or any other data or content from our site or via the API or any other Matchbook ' +
      'data from any other source (together, &ldquo;Matchbook Data&rdquo;) is strictly prohibited without the specific prior written consent of Triplebet Limited:' +
      '</p><p>Commercial use by any person; and/or Any use for any purpose by a competitor of Triplebet limited, or an employee, contractor or agent of any such ' +
      'competitor (&ldquo;Restricted Person&rdquo;), provided always that Restricted Persons may place bets. Screen scraping, web scraping or any other automated ' +
      'or manual collection of Matchbook Data, for commercial use by any person and/or for any use by a Restricted Person, is expressly prohibited.</p>' +
      '<p>Your Representations and Warranties</p><p>You hereby represent and warrant (and our decision to grant you membership of the Exchange and MB Casino is ' +
      'based upon such representations and warranties) that</p><p>you are fully and legally entitled to enter into this Agreement; your entering into this Agreement is ' +
      'not illegal in your jurisdiction of residence and you will not use the Exchange and/or MB Casino while located in any jurisdiction that prohibits the use of such ' +
      'services; you are 18 years of age or older; or the age of legal consent for engaging with our services under the laws of the jurisdiction in which you are located ' +
      'while using the Site, whichever is the higher; unless otherwise agreed by us in writing, you are acting as a principal and not as an agent on behalf of a third ' +
      'party; all details provided by you to the Exchange and MB Casino are accurate and that you will not take steps to conceal your true identity from the Exchange and MB ' +
      'Casino by, for example, without limitation, using pseudonyms, false addresses or taking technical steps to conceal your identity or location; your sole aim on opening ' +
      'an account on our licensed gaming platform is to establish a &lsquo;normal&rsquo; commercial relationship with Triplebet Limited, with the strict purpose of ' +
      'conducting betting and other gaming and gambling transactions; you understand that you will not receive any interest on any outstanding amount(s) in your account, ' +
      'and you shall not treat Triplebet Limited as a bank or other financial institution; you are the authorised user of any credit or debit card you use on the Exchange and ' +
      'MB Casino and that you have never failed to honour ' +
      'a liability on a bet by attempting to charge back a ' +
      'payment made by card for betting services; all and any monies utilized by you on the Exchange and MB Casino are the proceeds of or derived from lawful activities.<' +
      '/p>'
    },
    bettingMarketGroup :{
      match_start_on: 'Pre-Live! Starts on 10/01/2017' +
      ' 13:00',
      title: 'Levski Sofia vs Academic' +
      ' Plovdiv',
      time_remaining: 'Time Remaining',
      days: 'Days',
      hours: 'Hours',
      mins: 'Mins',
      secs: 'Secs',
      spread: 'Spread ',
      overunder: 'Over/Under ',
      moneyline: 'Moneyline ',
      over: 'Over ',
      under: 'Under '
    },
    logoutModal: {
      title: 'Logout',
      explanation: 'Your password is required to login. Please make sure you have stored your password in a safe place.',
      confirmation: 'Are you sure you want to logout?',
      skipLogoutPopupNextTime: 'Do not show me this message again',
      confirm: 'Logout',
      cancel: 'Cancel'
    },
    unplacedBetModal: {
      title: 'Confirm navigation',
      explanation: 'You have UNPLACED bets in your betslip. Your selections will be discarded when you leave this page. Are you sure you want to leave this page?',
      confirm: 'Leave this page',
      cancel: 'Stay on this page'
    },
    bannerClock: {
      header: 'Time Remaining',
      days: 'DAYS',
      hours: 'HOURS',
      minutes: 'MINS',
      seconds: 'SECS'
    }
  }
};

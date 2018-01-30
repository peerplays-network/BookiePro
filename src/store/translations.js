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
      exportNoDataMsg: 'No data to be exported',
      exportLoadingHeader: 'Exporting to .Xlsx',
      exportDownloadHeader: 'Export Completed',
      exportNoDataHeader: 'No data',
      exportStatusHeader: 'Export Failed',
      close: 'Close',
      unknown_error: 'Unknown Error',
      peerplays_logo_title: 'Powered by Peerplays'
    },
    initAccountModal: {
      line_1: 'Setting up your account for the first time... ',
      line_2: 'This might take few minutes.'
    },
    titleBar:{
      title: 'BookiePro',
      clock: 'Local Time %{time}'
    },
    searchMenu:{
      no_of_result_0: 'No results found',
      no_of_result: '%{count} results for "%{searchText}"',
      match_start_on: ' Thu, 10/01/2017 13:00',
      search_place_holder: 'Search Team',
      search_error: 'There are currently no betting markets for %{event}'
    },
    myAccount:{
      screenName: 'myAccount_',
      home:'Home',
      my_account: 'My Account',
      welcome_back: 'Welcome Back',
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
      oddsFormat: 'Choose Odds Format',
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
      transaction_status_complete: 'Completed',
      transaction_status_processing: 'Processing',
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
      new_acc_req_text: 'Create a new Bookie account',
      copy_text: 'Copy',
      download_rec_text: 'Save Password File',
      acc_name: 'Account Name',
      password_warning_1: 'If you lose your password, you will lose all of your funds!',
      password_warning_2: ' Keep your password safe!',
      password_warning_3: ' To download a text file of your password, click the save button below:',
      loginWithAccount: 'Or login with your existing Peerlays account',
      cannot_recover_password_warning: 'I understand that PBSA <span class="mediumMessageInText">cannot recover my password.</span>',
      securely_saved_password_warning: 'I have securely saved my password recovery file.',
      create_account: 'Create Account',
      already_account: 'Already have an account?',
      log_in: 'Log In',
      premium_acc_text: 'This is a premium name. Please enter a regular name containing least one dash, a number or no vowels.',
      password_no_match: 'The password you entered does not match',
      field_req: 'Field is required',
      acc_name_taken: 'Account Name is already taken'
    },
    login: {
      username: 'Account Name',
      password: 'Password',
      title: 'LOGIN',
      signup: 'SIGN UP',
      username_notfound: 'Account Name not found',
      password_short: 'password too short',
      wrong_username_password: 'wrong Account Name or password'
    },
    changePassword:{
      title: 'Change Your Password',
      enter_old_password: 'Enter your current password',
      enter_new_password: 'Enter your new password',
      confirm_new_password: 'Confirm your new password',
      enter_old_password_hint: 'Please enter the Current Password.',
      enter_new_password_hint: 'The New Password must be at least 22 characters long.',
      confirm_new_password_hint: 'Please enter the New Password again.',
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
      empty: 'No notification',
      deposit: 'The deposit of %{amount} %{currency} is confirmed',
      bet_resolved: 'A market you’ve bet on is ended and bets are resolved',
      software_update: 'New version available, update now',
      transaction_history_data_exported: 'Transaction History Data is exported'
    },
    softwareUpdate: {
      default: 'New version found. Please update the version',
    },
    welcome:{
      getting_started: 'Getting Started',
      place_bet: 'Placing a new bet',
      place_bet_desc: 'You can place a lay (against) bet by selecting the odds in the blue box. When placing a lay bet you are betting for an outcome not to happen' +
      ' - for example betting that Oakland will not beat Houston. Your bet against Oakland will therefore win if the result is either a Houston win or a draw.' +
      ' The current odds will automatically be selected' +
      ' but you can alter these to your liking.',
      headerText1: 'WELCOME TO BOOKIE!',
      contentText1: 'Bookie is a global sports betting exchange.\n' +
      '\n' +
      'Bettors from all over the world use Bookie to place bets on a huge range of sporting events.\n' +
      '\n' +
      'Bookie matches different users\' bets against each other, a little like a stock exchange',
      headerText2: 'DEPOSIT FUNDS',
      contentText2: 'To get started, you will need to deposit funds with Bookie.\n' +
      '\n' +
      'Currently, Bookie allow you to bet with Bitcoin.\n' +
      '\n' +
      'To deposit Bitcoin, you simply click on the Deposit button. You will be shown the address to send your Bitcoin to - both as a QR Code and as a Bitcoin public address.' +
      'Send funds from your chosen Bitcoin wallet to that address\n' +
      '\n' +
      'Withdrawing funds is just as simple - click on the Withdraw button, enter the public address of your Bitcoin wallet, and click SEND',
      headerText3: 'HOW TO MAKE A BET?',
      contentText3: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam leo augue, suscipit a purus at, ultricies tempor mi. Donec est turpis, viverra imperdiet venenatis sed,' +
      ' venenatis non ipsum. Donec ultrices turpis magna, eget lacinia turpis sagittis et. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. ' +
      'Aliquam faucibus arcu sit amet faucibus venenatis. Etiam id enim ac libero tempus molestie eu et ipsum. Phasellus convallis metus tellus, eget commodo purus mattis quis.',
      contentText4: 'Now you\'re ready to bet with Bookie!',
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
      account_balance: 'Account Balance',
      available: 'Available',
      in_game: 'In-game',
      myaccount:'My Account',
      help: 'Help & Support',
      signout: 'Logout'
    },
    landing:{
      login: 'LOGIN',
      signup: 'JOIN BOOKIEPRO NOW',
      slogan: 'Bet From Anywhere in The World',
      intro: 'Sign-up and start betting in 2 minutes!',
      loginWithAccount: 'Login with your existing Peerplays account',
      copyright: 'COPYRIGHT',
      privacy_policy: 'PRIVACY POLICY',
      registerStepTitle: 'Register',
      registerStepMessage: 'Create an account',
      depositStepTitle: 'Deposit',
      depositStepMessage: 'Add wallet',
      betStepTitle: 'Bet',
      betStepMessage: 'Easy Betting',
      help_and_support: 'HELP'
    },
    mybets:{
      // profit_liability: 'Profit / </br>Liability' +
      // '%{currency}',
      profit_liability: 'Profit / Liability',
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
      resolved_time: 'Resolved Time',
      time: 'Time',
      type: 'Type',
      sport: 'Sport',
      odds: 'Odds',
      stake: 'Stake',
      profit: 'Profit',
      balance: 'Balance',
      cancel: 'Cancel',
      cancel_all: 'Cancel All',
      home: 'home',
      mybets: 'My Bets',
      nodata: 'Sorry, no results found.',
      no_transactions: 'No recent transactions.',
      no_bets: 'No recent bets.',
      unmatched_bets: 'UNMATCHED BETS',
      matched_bets: 'MATCHED BETS',
      resolved_bets: 'RESOLVED BETS',
      date: 'Date',
      from: 'From',
      to: 'To',
      cancel_all_confirm: 'You are about to remove %{currencySymbol}%{betsTotal} bets, are you sure?'
    },
    complex_betting_widget:{
      back_all: 'Back all',
      lay_all: 'Lay all',
      offer: '--',
      matched: 'Matched',
      moneyline: 'Moneyline',
      in_play: 'IN-PLAY',
      going_in_play: 'GOING IN-PLAY'
    },
    simple_betting_widget:{
      no_data: 'There is no event to be displayed.',
      offer: '--',
      draw: 'The Draw',
      in_play: 'IN-PLAY'
    },
    quick_bet_drawer: {
      header: 'BETSLIP',
      unconfirmed_bets: {
        empty: {
          instructions: 'CLICK ON THE ODDS TO ADD<br/>SELECTIONS TO THE BETSLIP',
          my_bet_button: 'VIEW MY BETS'
        },
        confirmation: {
          imperfect: {
            bad_bets_1: 'There is 1 incomplete bet that cannot be placed.',
            bad_bets: 'There are %{bad_bets} incomplete bets that cannot be placed.',
            good_bets_1: 'Would you like to continue to place 1 bet with <span class="currency-label">%{amount}</span>?',
            good_bets: 'Would you like to continue to place %{good_bets} bets with <span class="currency-label">%{amount}</span>?',
            cancel_button: 'CANCEL',
            confirm_button: 'CONFIRM BET',
          },
          perfect: {
            good_bets_1: 'You are about to place 1 bet for a total liability of <span class="currency-label">%{amount}</span>.<br/> Are you sure?',
            good_bets: 'You are about to place %{good_bets} bets  for a total liability of <span class="currency-label">%{amount}</span>.<br/> Are you sure?',
            cancel_button: 'CANCEL',
            confirm_button: 'CONFIRM BET',
          },
        },
        error: {
          instructions: 'Sorry, we are unable to proceed<br/>with your request. Please try again!',
          cancel_button: 'CANCEL',
          confirm_button: 'TRY AGAIN',
        },
        delete_bets: {
          instructions: 'Are you sure you want to<br/>delete the bets in the event<br/>%{event}?',
          cancel_button: 'NO',
          confirm_button: 'YES',
        },
        success: {
          instructions: 'Your bets have been successfully placed.',
          my_bet_button: 'GO TO MY BETS',
        },
        insufficient_balance: {
          instructions: 'You do not have sufficient funds to place the bet/s. Please edit your bets or deposit more funds.',
          confirm_button: 'OK',
        },
        disconnected: {
          instructions: 'You are not connected to the blockchain. Please make sure you have Internet access and try again.',
          cancel_button: 'CANCEL',
        },
        content: {
          place_bet_button: 'PLACE BET %{amount}'
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
          my_bet_button: 'VIEW MY BETS'
        },
        confirmation: {
          imperfect: {
            bad_bets_1: 'There is 1 incomplete bet that cannot be placed.',
            bad_bets: 'There are %{bad_bets} incomplete bets that cannot be placed.',
            good_bets_1: 'Would you like to continue to place 1 bet with <span class="currency-label">%{amount}</span>?',
            good_bets: 'Would you like to continue to place %{good_bets} bets with <span class="currency-label">%{amount}</span>?',
            cancel_button: 'CANCEL',
            confirm_button: 'CONFIRM BET',
          },
          perfect: {
            good_bets_1: 'You are about to place 1 bet for a total liability of <span class="currency-label">%{amount}</span>.<br/> Are you sure?',
            good_bets: 'You are about to place %{good_bets} bets  for a total liability of <span class="currency-label">%{amount}</span>.<br/> Are you sure?',
            cancel_button: 'CANCEL',
            confirm_button: 'CONFIRM BET',
          },
        },
        error: {
          instructions: 'Sorry, we are unable to proceed<br/>with your request. Please try again!',
          cancel_button: 'CANCEL',
          confirm_button: 'TRY AGAIN',
        },
        delete_bets: {
          instructions: 'Are you sure you want to<br/>delete all the bets?',
          cancel_button: 'NO',
          confirm_button: 'YES',
        },
        success: {
          instructions: 'Your bets have been successfully placed.',
          my_bet_button: 'GO TO MY BETS',
        },
        insufficient_balance: {
          instructions: 'You do not have sufficient funds to place the bet/s. Please edit your bets or deposit more funds.',
          confirm_button: 'OK',
        },
        disconnected: {
          instructions: 'You are not connected to the blockchain. Please make sure you have Internet access and try again.',
          cancel_button: 'CANCEL',
        },
        content: {
          place_bet_button: 'PLACE BET %{amount}'
        }
      },
      placed_bets: {
        header: 'PLACED BETS',
        empty: {
          instructions: 'CLICK ON THE ODDS TO ADD<br/>SELECTIONS TO THE BETSLIP',
          my_bet_button: 'VIEW MY BETS'
        },
        confirmation: {
          imperfect: {
            bad_bets_1: 'There is 1 incomplete bet that cannot be updated.',
            bad_bets: 'There are %{bad_bets} incomplete bets that cannot be updated.',
            good_bets_1: 'Would you like to continue to update 1 bet with <span class="currency-label">%{amount}</span>?',
            good_bets: 'Would you like to continue to update %{good_bets} bets with <span class="currency-label">%{amount}</span>?',
            cancel_button: 'CANCEL',
            confirm_button: 'CONFIRM BET',
          },
          perfect: {
            good_bets_1: 'You are about to update 1 bet for a total liability of <span class="currency-label">%{amount}</span>.<br/> Are you sure?',
            good_bets: 'You are about to update %{good_bets} bets for a total liability of <span class="currency-label">%{amount}</span>.<br/> Are you sure?',
            cancel_button: 'CANCEL',
            confirm_button: 'CONFIRM BET',
          },
        },
        error: {
          instructions: 'Sorry, we are unable to proceed<br/>with your request. Please try again!',
          cancel_button: 'CANCEL',
          confirm_button: 'TRY AGAIN',
        },
        success: {
          instructions: 'Your bets have been successfully placed.',
          my_bet_button: 'GO TO MY BETS'
        },
        insufficient_balance: {
          instructions: 'You do not have sufficient funds to update the bet/s. Please edit your bets or deposit more funds.',
          confirm_button: 'OK',
        },
        disconnected: {
          instructions: 'You are not connected to the blockchain. Please make sure you have Internet access and try again.',
          cancel_button: 'CANCEL',
        },
        delete_bets: {
          instructions: 'Are you sure you want to<br/>cancel all unmatched bets?',
          cancel_button: 'NO',
          confirm_button: 'YES',
        },
      },
      unmatched_bets: {
        header: 'UNMATCHED BETS',
        content: {
          update_button: 'UPDATE %{amount}',
          reset_button: 'RESET',
        },
        no_data: 'There is no bet to be displayed.'
      },
      matched_bets: {
        header: 'MATCHED BETS',
        content: {
          average_odds: 'Average Odds',
        }
      }
    },
    rules_dialogue:{
      title: 'Rules',
      buttonTitle:'Rules',
      content: '<p>Predict the result of this match including any overtime that may be played. IN THE EVENT OF A TIE ' +
      'AFTER OVERTIME ALL BETS PLACED ON THIS MARKET WILL BE VOID. At kick off all unmatched bets will be cancelled ' +
      'and the market turned in-play, whereafter unmatched bets will not be cancelled at any time. It is the' +
      ' users own responsibility to manage their own' +
      ' positions. </p><p>Customers should be aware' +
      ' that: </br> Transmissions described as live by' +
      ' some broadcasters may actually be delayed and that all in-play ' +
      'matches are not necessarily televised.</p><p>The extent of any such delay may vary, depending on the set-up through ' +
      'which they are receiving pictures or data.</p>',

      //American Football
      'AmericanFootball':{
        Moneyline:{
          content: '<p>%{eventName}</br>' +
          '%{marketName}</p>' +
          '<p>Scheduled Event Start Time:</br>' +
          '%{datetime}</br>' +
          'Win Only Market</p>' +
          '<p>MARKET INFORMATION</p>' +
          '<p>For further information please see BookiePro Rules.</p>' +
          '<p>Who will win this match? This market INCLUDES any overtime that may be played. IN THE EVENT OF A TIE AFTER OVERTIME ALL BETS PLACED ON THIS MARKET WILL BE VOID. ' +
          'At the start of play all unmatched bets will be cancelled and the market turned in-play. </p>' +
          '<p>Please note that this market will not be actively managed therefore it is the responsibility of all users to manage their in-play positions. ' +
          'Please also be aware that transmissions described as “live” by some broadcasters may actually be delayed and that not all in-play matches are necessarily televised. </p>' +
          '<p>Commission and Network Fees apply to all bets placed in this market.</p>',
        },
        'Spread':{
          content: '<p>%{eventName}</br>' +
          '%{marketName}</p>' +
          '<p>Scheduled Event Start Time:</br>' +
          '%{datetime}</br>' +
          'Win Only Market</p>' +
          '<p>MARKET INFORMATION</p>' +
          '<p>For further information please see BookiePro Rules.</p>' +
          '<p>Which team will win this match with the stated handicap applied? This market INCLUDES any overtime that may be played. ' +
          'At the start of play all unmatched bets will be cancelled and the market turned in-play. </p>' +
          '<p>Please note that this market will not be actively managed therefore it is the responsibility of all users to manage their in-play positions. ' +
          'Please also be aware that transmissions described as “live” by some broadcasters may actually be delayed and that not all in-play matches are necessarily televised.</p>' +
          '<p>Commission and Network Fees apply to all bets placed in this market.</p>',
        },
        'OverUnder':{
          content: '<p>%{eventName}</br>' +
          '%{marketName}</p>' +
          '<p>Scheduled Event Start Time:</br>' +
          '%{datetime}</br>' +
          'Win Only Market</p>' +
          '<p>MARKET INFORMATION</p>' +
          '<p>For further information please see BookiePro Rules.</p>' +
          '<p>How many points in total will be scored in this game  - more or less than the stated number? This market INCLUDES any overtime that may be played. ' +
          'At the start of play all unmatched bets will be cancelled and the market turned in-play. </p>' +
          '<p>Please note that this market will not be actively managed therefore it is the responsibility of all users to manage their in-play positions. ' +
          'Please also be aware that transmissions described as “live” by some broadcasters may actually be delayed and that not all in-play matches are necessarily televised.</p>' +
          '<p>Commission and Network Fees apply to all bets placed in this market.</p>',
        },

      },
      //BasketBall
      'Basketball':{
        Moneyline:{
          content: '<p>%{eventName}</br>' +
          '%{marketName}</p>' +
          '<p>Scheduled Event Start Time:</br>' +
          '%{datetime}</br>' +
          'Win Only Market</p>' +
          '<p>MARKET INFORMATION</p>' +
          '<p>For further information please see BookiePro Rules.</p>' +
          '<p>Who will win this match? This market INCLUDES any overtime that may be played. ' +
          'At the start of play all unmatched bets will be cancelled and the market turned in-play. </p>' +
          '<p>Please note that this market will not be actively managed therefore it is the responsibility of all users to manage their in-play positions. ' +
          'Please also be aware that transmissions described as “live” by some broadcasters may actually be delayed and that not all in-play matches are necessarily televised.</p>' +
          '<p>Commission and Network Fees apply to all bets placed in this market.</p>',
        },
        'Spread':{
          content: '<p>%{eventName}</br>' +
          '%{marketName}</p>' +
          '<p>Scheduled Event Start Time:</br>' +
          '%{datetime}</br>' +
          'Win Only Market</p>' +
          '<p>MARKET INFORMATION</p>' +
          '<p>For further information please see BookiePro Rules.</p>' +
          '<p>Which team will win this match with the stated handicap applied? This market INCLUDES any overtime that may be played. ' +
          'At the start of play all unmatched bets will be cancelled and the market turned in-play. </p>' +
          '<p>Please note that this market will not be actively managed therefore it is the responsibility of all users to manage their in-play positions. ' +
          'Please also be aware that transmissions described as “live” by some broadcasters may actually be delayed and that not all in-play matches are necessarily televised.</p>' +
          '<p>Commission and Network Fees apply to all bets placed in this market.</p>',
        },
        'OverUnder':{
          content: '<p>%{eventName}</br>' +
          '%{marketName}</p>' +
          '<p>Scheduled Event Start Time:</br>' +
          '%{datetime}</br>' +
          'Win Only Market</p>' +
          '<p>MARKET INFORMATION</p>' +
          '<p>For further information please see BookiePro Rules.</p>' +
          '<p>How many points in total will be scored in this game - more or less than the stated number? This market INCLUDES any overtime that may be played. ' +
          'At the start of play all unmatched bets will be cancelled and the market turned in-play. </p>' +
          '<p>Please note that this market will not be actively managed therefore it is the responsibility of all users to manage their in-play positions. ' +
          'Please also be aware that transmissions described as “live” by some broadcasters may actually be delayed and that not all in-play matches are necessarily televised.</p>' +
          '<p>Commission and Network Fees apply to all bets placed in this market.</p>',
        },

      },
      //BaseBall
      'Baseball':{
        //dummy not yet definied in ACD_v1.0
        Moneyline:{
          content: '<p>%{eventName}</br>' +
          '%{marketName}</p>' +
          '<p>Scheduled Event Start Time:</br>' +
          '%{datetime}</br>' +
          'Win Only Market</p>' +
          '<p>MARKET INFORMATION</p>' +
          '<p>For further information please see BookiePro Rules.</p>' +
          '<p>Who will win this match? This market INCLUDES any overtime that may be played. ' +
          'At the start of play all unmatched bets will be cancelled and the market turned in-play</p>' +
          '<p>Please note that this market will not be actively managed therefore it is the responsibility of all users to manage their in-play positions. ' +
          'Please also be aware that transmissions described as “live” by some broadcasters may actually be delayed and that not all in-play matches are necessarily televised.</p>' +
          '<p>Commission and Network Fees apply to all bets placed in this market.</p>',
        },
        //dummy not yet definied in ACD_v1.0
        'Spread':{
          content: '<p>%{eventName}</br>' +
          '%{marketName}</p>' +
          '<p>Scheduled Event Start Time:</br>' +
          '%{datetime}</br>' +
          'Win Only Market</p>' +
          '<p>MARKET INFORMATION</p>' +
          '<p>For further information please see BookiePro Rules.</p>' +
          '<p>Who will win this match? This market INCLUDES any overtime that may be played. ' +
          'At the start of play all unmatched bets will be cancelled and the market turned in-play</p>' +
          '<p>Please note that this market will not be actively managed therefore it is the responsibility of all users to manage their in-play positions. ' +
          'Please also be aware that transmissions described as “live” by some broadcasters may actually be delayed and that not all in-play matches are necessarily televised.</p>' +
          '<p>Commission and Network Fees apply to all bets placed in this market.</p>',
        },
        //dummy not yet definied in ACD_v1.0
        'OverUnder':{
          content: '<p>%{eventName}</br>' +
          '%{marketName}</p>' +
          '<p>Scheduled Event Start Time:</br>' +
          '%{datetime}</br>' +
          'Win Only Market</p>' +
          '<p>MARKET INFORMATION</p>' +
          '<p>For further information please see BookiePro Rules.</p>' +
          '<p>Who will win this match? This market INCLUDES any overtime that may be played. ' +
          'At the start of play all unmatched bets will be cancelled and the market turned in-play</p>' +
          '<p>Please note that this market will not be actively managed therefore it is the responsibility of all users to manage their in-play positions. ' +
          'Please also be aware that transmissions described as “live” by some broadcasters may actually be delayed and that not all in-play matches are necessarily televised.</p>' +
          '<p>Commission and Network Fees apply to all bets placed in this market.</p>',
        },

      },
      //Soccer
      'Soccer':{
        //dummy not yet definied in ACD_v1.0
        Moneyline:{
          content: '<p>%{eventName}</br>' +
          '%{marketName}</p>' +
          '<p>Scheduled Event Start Time:</br>' +
          '%{datetime}</br>' +
          'Win Only Market</p>' +
          '<p>MARKET INFORMATION</p>' +
          '<p>For further information please see BookiePro Rules.</p>' +
          '<p>Who will win this match? This market INCLUDES any overtime that may be played. ' +
          'At the start of play all unmatched bets will be cancelled and the market turned in-play</p>' +
          '<p>Please note that this market will not be actively managed therefore it is the responsibility of all users to manage their in-play positions. ' +
          'Please also be aware that transmissions described as “live” by some broadcasters may actually be delayed and that not all in-play matches are necessarily televised.</p>' +
          '<p>Commission and Network Fees apply to all bets placed in this market.</p>',
        },
        //dummy not yet definied in ACD_v1.0
        'Spread':{
          content: '<p>%{eventName}</br>' +
          '%{marketName}</p>' +
          '<p>Scheduled Event Start Time:</br>' +
          '%{datetime}</br>' +
          'Win Only Market</p>' +
          '<p>MARKET INFORMATION</p>' +
          '<p>For further information please see BookiePro Rules.</p>' +
          '<p>Who will win this match? This market INCLUDES any overtime that may be played. ' +
          'At the start of play all unmatched bets will be cancelled and the market turned in-play</p>' +
          '<p>Please note that this market will not be actively managed therefore it is the responsibility of all users to manage their in-play positions. ' +
          'Please also be aware that transmissions described as “live” by some broadcasters may actually be delayed and that not all in-play matches are necessarily televised.</p>' +
          '<p>Commission and Network Fees apply to all bets placed in this market.</p>',
        },
        'OverUnder':{
          content: '<p>%{eventName}</br>' +
          '%{marketName}</p>' +
          '<p>Scheduled Event Start Time:</br>' +
          '%{datetime}</br>' +
          'Win Only Market</p>' +
          '<p>MARKET INFORMATION</p>' +
          '<p>For further information please see BookiePro Rules.</p>' +
          '<p>How many goals in total will be scored in this match - more or less than the stated number? ' +
          'All bets apply to Full Time according to the match officials, plus any stoppage time. ' +
          'Extra-time/penalty shoot-outs are not included. At the start of play all unmatched bets will be cancelled and the market turned in-play. </p>' +
          '<p>Please note that this market will not be actively managed therefore it is the responsibility of all users to manage their in-play positions. ' +
          'Please also be aware that transmissions described as “live” by some broadcasters may actually be delayed and that not all in-play matches are necessarily televised.</p>' +
          '<p>Commission and Network Fees apply to all bets placed in this market.</p>',
        },
        'Matchodds':{
          content: '<p>%{eventName}</br>' +
          '%{marketName}</p>' +
          '<p>Scheduled Event Start Time:</br>' +
          '%{datetime}</br>' +
          'Win Only Market</p>' +
          '<p>MARKET INFORMATION</p>' +
          '<p>For further information please see BookiePro Rules.</p>' +
          '<p>Predict the result of this match. All bets apply to Full Time according to the match officials, plus any stoppage time. ' +
          'Extra-time/penalty shoot-outs are not included. At the start of play all unmatched bets will be cancelled and the market turned in-play. </p>' +
          '<p>Please note that this market will not be actively managed therefore it is the responsibility of all users to manage their in-play positions. ' +
          'Please also be aware that transmissions described as “live” by some broadcasters may actually be delayed and that not all in-play matches are necessarily televised.</p>' +
          '<p>Commission and Network Fees apply to all bets placed in this market.</p>',
        },
        'Correctscore':{
          content: '<p>%{eventName}</br>' +
          '%{marketName}</p>' +
          '<p>Scheduled Event Start Time:</br>' +
          '%{datetime}</br>' +
          'Win Only Market</p>' +
          '<p>MARKET INFORMATION</p>' +
          '<p>For further information please see BookiePro Rules.</p>' +
          '<p>Predict the score of this match. All bets apply to Full Time according to the match officials, plus any stoppage time. ' +
          'Extra-time/penalty shoot-outs are not included. At the start of play all unmatched bets will be cancelled and the market turned in-play. </p>' +
          '<p>Please note that this market will not be actively managed therefore it is the responsibility of all users to manage their in-play positions. ' +
          'Please also be aware that transmissions described as “live” by some broadcasters may actually be delayed and that not all in-play matches are necessarily televised.</p>' +
          '<p>Commission and Network Fees apply to all bets placed in this market.</p>',
        },

      }
    },
    AllSports:{
      bannerText: 'In-play in %{numberOfActiveEvents} open games',
      allSports: 'ALL SPORTS'
    },
    privacy_dialogue:{
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
      match_start_on: '%{time}',
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
    connectionErrorModal: {
      title: 'Connection Error',
      explanation: 'Could not connect to the Blockchain',
      noInternet: 'Could not connect to the internet',
      confirm: 'Try Again',
    },
    unplacedBetModal: {
      title: 'Confirm navigation',
      explanation: 'You have UNPLACED bets in your betslip. Your selections will be discarded when you leave this page. Are you sure you want to leave this page?',
      confirm: 'Leave this page',
      cancel: 'Stay on this page'
    },
    bannerClock: {
      header: 'Going in-play in:',
      days: 'DAYS',
      hours: 'HOURS',
      minutes: 'MINS',
      seconds: 'SECS'
    },
    transaction: {
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      transfer: 'Transfer',
      makeBet: 'Make Bet',
      cancelBet: 'Cancel Bet',
      betMatched: 'Bet Matched',
      betCancelled: 'Bet Cancelled',
      bettingMarketResolved: 'Betting Market Resolved',
    },
    help: {
      title: 'HELP AND SUPPORT',
      header: 'FAQS',
      topicOverview: {
        header: 'Overview',
        questionAnswerPairs: [
          {
            question: 'What is Bookie?',
            answer: 'Bookie is a betting exchange where people from all over the world can bet on sports.'
          },
          {
            question: 'How is Bookie different from a regular sportsbook?',
            answer: 'When you bet with a sportsbook, your wager is matched by the “house” (the sportsbook operator). ' +
            'If you win this bet, this sportsbook operator pays you directly. ' +
            'Bookie has no house. Instead, Bookie matches your bet with other users who want to bet against you.'
          },
          {
            question: 'How does the Bookie betting exchange work?',
            answer: 'A betting exchange is similar to a stock exchange. A stock exchange matches orders between anyone' +
            ' who wants to buy and sell stocks. A betting exchange matches the orders between anyone who wants to place or take bets.'
          },
          {
            question: 'How do I find someone to bet with?',
            answer: 'Bookie automatically matches bets between you and other users from around the world. All you have to do is choose a sport and event to bet on, tell Bookie how ' +
            'much you want to bet, and post the funds to cover your bet. Bookie takes care of the rest - matching your bet at best available price, holding all funds in escrow, and then releasing ' +
            'the funds to the winner when the sports event is finished.'
          },

          {
            question: 'How is Bookie different from other betting exchanges?',
            answer: 'Traditional betting exchanges operate the software which matches your bets on a centralized server. On Bookie, the software that matches your bets operates ' +
            'on a public blockchain. This makes Bookie transparent and accessible from every country on Earth.'
          },
          {
            question: 'Is there a charge for me to bet with Bookie?',
            answer: 'Yes. Bookie charges an industry-low commission of X% on all net winnings in a betting market.'
          },
          {
            question: 'Will Bookie restrict my account if I win too much?',
            answer: 'No. Bookie does not close or limit the accounts of users, unlike many sportsbooks and betting exchanges.'
          },
          {
            question: 'What currencies can I bet with on Bookie?',
            answer: 'Bookie is capable of accepting all digital currencies, but since Bitcoin is the most widely traded and liquid digital currency right now, ' +
            'Bookie is a “Bitcoin-only” desktop application.'
          }
        ],
      },
      topicAccount: {
        header: 'Account Management & Security',
        questionAnswerPairs: [
          {
            question: '',
            answer: 'This section has been disabled for Beta Phase 1 period'
          }
          /*{
            question: 'How do I sign up for a Bookie account?',
            answer: 'Opening an account with Bookie is very quick and very simple. Click the SIGN UP button on the Bookie app front page and follow the on-screen instructions. \n' +
            '\n' +
            '1.\tChoose an Account Name. The Account Name should contain at least one number.\n' +
            '2.\tA random 22-character password is automatically generated for you. Copy and paste this password into the password confirmation box. ' +
            'It is IMPORTANT that you back up or save your password securely.\n' +
            '3.\tDownload the file containing your password (this is one way of backing-up your password)\n' +
            '4.\tTick the two boxes if you agree XXX\n' +
            '5.\tClick the XXX button'
          },
          {
            question: 'Will I need to provide any ID, proof of address, or other personal documentation when signing up for a Bookie account?',
            answer: 'No. Bookie does not require any personal information for Account creation.'
          },
          {
            question: 'What personal information does Bookie hold about me?',
            answer: 'Bookie does not store or hold any personal information about you whatsoever, not even your name.'
          },
          {
            question: 'Is Bookie safe/secure?',
            answer: 'answer'
          },

          {
            question: 'Does Bookie track or store my IP address or any other such data?',
            answer: 'Bookie does not store or track user IP addresses, mac addresses or any other such identifying information.'
          },
          {
            question: 'What information do I need to log in to my Bookie account?',
            answer: 'Only two items of information are' +
            ' required to log in to Bookie: \n' +
            '1.\t User name \n' +
            '2.\t Password \n' +
            'It is important that you save your Bookie ' +
            'password in a secure offline place. \n' +
            'See below for more information regarding Bookie password.'
          },
          {
            question: 'How do I recover my Bookie password?',
            answer: 'There is no way to recover your Bookie password. If you lose your Bookie password you will not be able to log in to your Bookie account and you will lose access to ' +
            'all funds in that account forever. When creating a Bookie account, every user is prompted to save a file containing the password to their hard drive. Users should also save ' +
            'their password in a secure place offline. Never share your password with anyone.'
          },
          {
            question: 'I’ve lost my Bookie password, what should I do?',
            answer: 'If you lose your Bookie password, you will not be able to log in to your Bookie account again. Ever. All funds in that account will remain untouched but inaccessible.'
          },
          {
            question: 'Who can I share my password with?',
            answer: 'NEVER share your password with anyone. You are the ONLY person who knows your password - keep it that way! Only enter your password into the ' +
            'Bookie application, never anywhere else.'
          },
          {
            question: 'Can I change my password?',
            answer: 'Yes. Go to My Account, which is accessible on the far right of the Menu bar. From there, click on CHANGE PASSWORD and follow the instructions. ' +
            'Your new password must contain 22 characters. Characters can be letters (both upper- and lower-case) and numbers.'
          },
          {
            question: 'Can I open more than one Bookie account?',
            answer: 'Yes, this is allowed. This may be useful for users who are trying to separate different kinds of betting activity and/or strategies. ' +
            'There is no cost for opening a new Bookie account.'
          },
          {
            question: 'Can I open a Bookie account from anywhere in the world?',
            answer: 'Bookie places no geographical restrictions on the location of its users. However XXXX all users are responsible for checking local laws etc XXXX'
          },
          {
            question: 'Can I change my Account Name?',
            answer: 'No, the Account Name cannot be changed after the account has been created. However, a new account can be created with a different ' +
            'account name and funds can then be transferred between the two accounts.'
          },
          {
            question: 'Can I login to my account from multiple devices?',
            answer: 'Yes. Simply download the Bookie app to a second device and log in using your Account Name and password. No further information is required to log in to your Bookie account.'
          },
          {
            question: 'Why can’t I access my Bookie account?',
            answer: 'answer'
          },
          {
            question: 'Where can I view all my current bets?',
            answer: 'answer'
          },
          {
            question: 'Where can I view my bet history?',
            answer: 'answer'
          },
          {
            question: 'Where can I view all my Bookie transactions?',
            answer: 'answer'
          }*/
        ],
      },
      topicFunds: {
        header: 'Funds',
        questionAnswerPairs: [
          {
            question: '',
            answer: 'This section has been disabled for Beta Phase 1 period'
          }
          /*{
            question: 'What currencies can I bet with on Bookie?',
            answer: 'Bitcoin is the only currency that can be used on Bookie right now. Bookie is capable of accepting all digital currencies, but since Bitcoin is the ' +
            'most widely traded and ' +
            'liquid digital currency right now, Bookie is a “Bitcoin-only” desktop application at the current time. Other digital currencies may be enabled in the future. '
          },
          {
            question: 'How do I get Bitcoin?',
            answer: 'XX'
          },
          {
            question: 'How do I deposit funds (Bitcoin) with Bookie?',
            answer: 'answer'
          },
          {
            question: 'How do I withdraw funds (Bitcoin) from Bookie?',
            answer: 'answer'
          },

          {
            question: 'Can I cancel my withdrawal request?',
            answer: 'answer'
          },
          {
            question: 'Can I set a daily withdrawal limit?',
            answer: 'answer'
          },
          {
            question: 'When I leave funds in Bookie, are they secure?',
            answer: 'answer'
          },
          {
            question: 'Does Bookie use encrypted, secure connections?',
            answer: 'answer'
          }*/
        ],
      },
      topicBetting: {
        header: 'Betting',
        questionAnswerPairs: [
          {
            question: 'How do I place a bet on Bookie?',
            answer: 'Bookie is a betting exchange, which allows you to place a bet by either ' + '<b>Backing</b> (as bettors normally do) or <b>Laying</b> a bet (like a sportsbook would do).' + 
            'Bookie has no ‘house’, so all bets you place will be matched by other ' +
            'Bookie users, who want to take the opposite side of your bet.\n\n' +
            'To get started:\n' + 
            '&nbsp;&nbsp;&nbsp;&nbsp;1. Choose a sport from the menu on the left\n' + 
            '&nbsp;&nbsp;&nbsp;&nbsp;2. Select the apropriate League (NFL, EPL, etc)\n' + 
            '&nbsp;&nbsp;&nbsp;&nbsp;3. Select the game or match you wish to place a bet on (e.g. NY ' +
            'Jets v NY Giants)\n' + 
            '&nbsp;&nbsp;&nbsp;&nbsp;4. Select the market you wish to bet on (e.g. Moneyline)\n' +
            '&nbsp;&nbsp;&nbsp;&nbsp;5. Place the bet\n\n' + 
            'Read on for further explanation on placing your bet.'
          },
          {
            question: 'What is a Betting Market?',
            answer: 'A betting market can be seen as a question and a list of possible answers ' +
            'to that question. For example, in a Moneyline betting market, the question is, ' +
            '“Which team is going to win this game?” The list of answers to that question would, ' +
            'for example, be, 1) New England Patriots, or 2) New York Giants. By making a bet, ' +
            'the bettor is effectively choosing an answer to the question.'
          },
          {
            question: 'What is a Selection?',
            answer: 'A selection is simply one particular “answer” within a betting market. ' +
            'For example, “New England Patriots” is a selection in the above Moneyline ' +
            'betting market. “New York Giants” is the other selection.'
          },
          {
            question: 'What is a ‘back’ bet?',
            answer: 'Simply put, to ‘back’ a selection is to bet on that particular result ' +
            'happening. For example, ‘backing’ New England in a game is betting on New England ' + 
            'to win that game.'
          },
          {
            question: 'What is a ‘lay’ bet?',
            answer: 'To ‘lay’ a selection is to bet on a particular result NOT happening. ' +
            'Put another way, it is betting AGAINST a particular result. So, ‘laying’ New ' +
            'England in a game is placing a bet for them NOT to win.'
          },
          {
            question: 'What is a ‘matched’ or ‘unmatched’ bet?',
            answer: 'Once a bet is taken by someone on the opposing side, it is matched and ' +
            'cannot be cancelled or changed. The bet is active and must wait until the event ' +
            'is finished and the results are determined.\n\nUnmatched bets have not been taken ' +
            'by someone on the opposing side. Unmatched bets can be cancelled or changed until ' +
            'they are matched.'
          },
          {
            question: 'What are Stake and Liability?',
            answer: 'In a back bet, your stake is the monetary amount placed on the bet. If the ' +
            'outcome does NOT win, you lose on this amount.\n\nIn a lay bet, your liability is ' +
            'the amount of money you stand to lose. For example, laying a 10 mBTC bet at 2.32 ' +
            'odds, your liability is 13.20. That is, you stand to lose 13.20.'
          },
          {
            question: 'What odds can I bet at?',
            answer: 'Bookie uses a Decimal odds system at its core. Bookie allows you to bet ' +
            'using the Decimal odds increments specified in the table below. Bookie also allows ' +
            'users to display odds in both Decimal and American formats.\n\n' +
            '<table><tbody><tr><td><b>Price</b></td><td style="padding-left:15px;"><b>Increment</b></td></tr>' +
            '<tr><td>1.01 → 2</td><td style="padding-left:15px;">0.01</td></tr>' +
            '<tr><td>2 → 3</td><td style="padding-left:15px;">0.02</td></tr>' +
            '<tr><td>3 → 4</td><td style="padding-left:15px;">0.05</td></tr>' +
            '<tr><td>4 → 6</td><td style="padding-left:15px;">0.1</td></tr>' +
            '<tr><td>6 → 10</td><td style="padding-left:15px;">0.2</td></tr>' +
            '<tr><td>10 → 20</td><td style="padding-left:15px;">0.5</td></tr>' +
            '<tr><td>20 → 30</td><td style="padding-left:15px;">1</td></tr>' +
            '<tr><td>30 → 50</td><td style="padding-left:15px;">2</td></tr>' +
            '<tr><td>50 → 100</td><td style="padding-left:15px;">5</td></tr>' +
            '<tr><td>100 → 1000</td><td style="padding-left:15px;">10</td></tr></tbody></table>'
          },
          {
            question: 'Is there a minimum/maximum bet amount?',
            answer: 'The minimum backer’s stake is 1 mBTC. The minimum layer’s liability is 0.01 ' +
            'mBTC.\nThere is no maximum bet amount.'
          },
          {
            question: 'How do I cancel a bet?',
            answer: 'Matched bets cannot be canceled.\n\n' +
            'You may cancel an unmatched bet at any time by either:\n' +
            '(i) Navigating to ‘My Bets’ using the icon on the top bar. ' +
            'From there you can choose to view all unmatched bets and cancel by clicking “Cancel”.\n' +
            'or\n(ii)  Navigating to the betting market where you placed the bet, clicking on ' +
            '“Placed Bets” in the betslip on the right, where you will be able to view and cancel ' +
            'any unmatched bets you have in that market.'
          },
          {
            question: 'What is Live betting?',
            answer: 'Live betting is when you bet during the actual event/match/game. Bookie offers Live betting on many different Events. All bets placed ' +
            'before a match goes live (turned In-Play XXXX terminology….) will be cancelled when the market goes in-play.'
          },
          {
            question: 'Why is there a delay in submitting a new or edited bet in Live betting?',
            answer: 'Bookie introduces a delay of between 3 and 10 seconds to all new and edited bets being submitted to a Live market. This is to minimize ' +
            'the advantage that can be gained by certain user having more recent access to new events in a match or game (for example, if they are attending ' +
            'the actual event in person). In this way, Bookie levels the playing field for everyone and ensures a proper balance in Live markets between functionality and fairness. \n' +
            'Please note that there is no delay involved when cancelling a bet in a Live market.'
          },
          {
            question: 'How does Bookie decide which bets are winners, and which are losers?',
            answer: 'On Bookie, there are two processes' +
            ' for deciding winning and losing bets: \n' +
            '1. Grading\n ' +
            'Grading is when each selection in a market is tagged either as a winner or a loser Grading happens typically within 30 minutes of a market closing.\n' +
            'Bets can also be graded as “void bets” in' +
            ' which case all stakes are returned. \n' +
            '2. Settling\n' +
            'Once grading'
          },
          {
            question: 'I believe my bet has been graded incorrectly. What can I do?',
            answer: 'After Grading - (Notification) Check and Escalate. Wait (another notification)'
          },
          {
            question: 'I believe my bet has been settled incorrectly. What can I do?',
            answer: 'A settled bet on Bookie (i.e. where funds have been paid out as winning bets) is final and irreversible. Funds cannot be reclaimed from accounts ' +
            'once they have been settled (paid out) by Bookie. ' +
            'Users have an opportunity to contest grading (see above) but not settlement.'
          },
          {
            question: 'How long after an Event finishes do bets get settled?',
            answer: 'Bets are normally settled within one hour of the event finishing.'
          },
          {
            question: 'What is the source of the betting information on Bookie?',
            answer: 'Bookie is populated with sports betting data using a decentralized ' +
            'Oracle system that is connected to multiple third party sports data feeds.'
          }
        ],
      },
      topicFees: {
        header: 'Commision & Fees',
        questionAnswerPairs: [
          {
            question: '',
            answer: 'This section has been disabled for Beta Phase 1 period'
          }
          /*{
            question: 'What charges does Bookie make on users?',
            answer: 'Bookie has two different charges: \n' +
            '1. Commission \n' +
            '2. Network Fee'
          },
          {
            question: 'What is Commission?',
            answer: 'answer'
          },
          {
            question: 'What is Network Fee?',
            answer: 'Unlike Commission, the Network Fee is charged regardless of if you are Net winner in a Market. Network Fee is not refunded.'
          },
          {
            question: 'Will I be charged Commission if my bet loses?',
            answer: 'answer'
          }*/
        ],
      },
      /*topicSports: {
        header: 'Sports / Markets',
        questionAnswerPairs: [
          {
            question: 'Will Bookie include other type of sports in the future?',
            answer: 'answer'
          }
        ],
      },
      topicRules: {
        header: 'Rules',
        questionAnswerPairs: [
          {
            question: 'question',
            answer: 'answer'
          }
        ],
      },*/
      topicAbout: {
        header: 'About Bookie',
        questionAnswerPairs: [
          {
            question: 'Who owns Bookie?',
            answer: 'No single person, company, or central authority owns Bookie. The Bookie betting exchange is an application that interfaces with the Peerplays ' +
            'blockchain. The holders of Peerplays blockchain tokens (called ‘PPY’) are in charge of voting to maintain consensus about the management of the network.'
          },
          {
            question: 'What is a blockchain?',
            answer: 'A blockchain is a digital database managed by a decentralized collective of digital stakeholders.Blockchains use advanced cryptographic techniques ' +
            'to securely record your transactions on a public network. Bookie runs on the Peerplays blockchain, which is custom-built to support online gambling.'
          },
          {
            question: 'Where do Bookie’s revenues go?',
            answer: 'All profits generated by Bookie (commission and network fees) are paid out at regular intervals to anyone who holds PPY tokens.'
          },
          {
            question: 'How can I become a PPY Token holder and share in the profits from Bookie?',
            answer: 'PPY tokens can be bought on a number of exchanges.'
          },

          {
            question: 'Who is the team behind Bookie?',
            answer: 'The development of Bookie has been supported by the Peerplays Blockchain Standards Association (PBSA), a non-profit organization based in Canada and dedicated to promoting ' +
            'transparent and fair gaming standards for the Peerplays blockchain. For more information please visit www.pbsa.info.'
          },
        ],
      }/*,
      topicMisc: {
        header: 'Miscellaneous',
        questionAnswerPairs: [
          {
            question: 'Can I use Bookie on my mobile?',
            answer: 'The Bookie mobile app (android) will launch in Q1 2018. Bookie will first be made available as a desktop application, launching in Q4 2017.'
          },
          {
            question: 'Can I build a bot on Peerplays blockchain? ',
            answer: 'answer'
          },
          {
            question: 'Does Bookie have an API for integration with third party trading software?',
            answer: 'answer'
          },
          {
            question: 'Is it necessary to update Bookie when a new version is available?',
            answer: 'answer'
          },
          {
            question: 'What is mB?',
            answer: '[milli-bitcoin, 1mB = 0.0001 bitcoin]'
          },
          {
            question: 'What should I do if Bookie indicates an offline status?',
            answer: 'answer'
          },
          {
            question: 'What are the minimum system requirements for running the Bookie app?',
            answer: 'answer'
          },
          {
            question: 'Will there be new features added to Bookie?',
            answer: '[e.g. Cash Out? Bet view?]'
          },
          {
            question: 'Do you have an MIT lisence for the Bookie Application?',
            answer: 'Click <a href="#" class="mit-license-anchor">here</a> to view the MIT license'
          }
        ],
    }*/,
      // TODO: the following should be deprecated but floating help is still referring to these
      // Revisit this after the floating help is revamped
      question1: 'What is BookiePro?',
      answer1: 'BookiePro is a betting exchange where people from all over the world can bet on sports.',
      question2: 'How is BookiePro different from a regular sportsbook?',
      answer2: 'When you bet with a sportsbook, your wager is matched by the “house”' +
      '(the sportsbook operator). If you win this bet, this sportsbook operator pays you directly.' +
      'BookiePro has no house. Instead, BookiePro matches your bet with other users who want to bet against you.',
      question3: 'Who owns BookiePro?',
      answer3: 'No single person, company, or central authority owns BookiePro. The BookiePro betting exchange ' +
      'is an application that interfaces with the Peerplays blockchain. The holders of Peerplays blockchain ' +
      'tokens (called ‘PPY’) are in charge of voting to maintain consensus about the management of the network.',
      question4: 'What is a blockchain?',
      answer4: 'A blockchain is a digital database managed by a decentralized collective of digital stakeholders. ' +
      'Blockchains use advanced cryptographic techniques to securely record your transactions on a public network. ' +
      'BookiePro runs on the Peerplays blockchain, which is custom-built to support online gambling.',
      question5: 'How does the BookiePro betting exchange work?',
      answer5: 'A betting exchange is similar to a stock exchange. A stock exchange matches orders between anyone who ' +
      'wants to buy and sell stocks. A betting exchange matches the orders between anyone who wants to place or take bets.',
      question6: 'How do I find someone to bet with?',
      answer6: 'BookiePro automatically matches bets between you and other users from around the world. ' +
      'All you have to do is choose a sport and event to bet on, tell BookiePro how much you want to bet, ' +
      'and post the funds to cover your bet. BookiePro takes care of the rest - matching your bet at best available price, ' +
      'holding all funds in escrow, and then releasing the funds to the winner when the sports event is finished.',
      question7: 'How is BookiePro different from other betting exchanges?',
      answer7: 'Traditional betting exchanges operate the software which matches your bets on a centralized server. ' +
      'On BookiePro, the software that matches your bets operates on a public blockchain. This makes BookiePro transparent ' +
      'and accessible from every country on Earth.',
      question8: 'Will BookiePro take a cut or \'rake\' of my winnings?',
      answer8: 'No. In contrast to other betting exchanges, BookiePro does not take a commission on winning bets. ' +
      'Instead, BookiePro charges a small commission on each bet when it is matched. This fee is calculated as a ' +
      'percentage of the betting stake.',
      question9: 'Will BookiePro restrict my account if I win too much?',
      answer9: 'No. BookiePro does not close or limit the accounts of users, unlike many sportsbooks and betting exchanges. ' +
      'BookiePro welcomes winners!',
      question10: 'What currencies can I bet with on BookiePro?',
      answer10: 'BookiePro is capable of accepting all digital currencies, but since Bitcoin is the most widely traded and ' +
      'liquid digital currency right now, BookiePro will be launched as a “Bitcoin-only” desktop application.',
      question11: 'Where do BookiePro’s revenues go?',
      answer11: 'All profits generated by BookiePro are paid out at regular intervals to anyone who holds PPY tokens.',
      question12: 'Can I use BookiePro on my mobile?',
      answer12: 'The BookiePro mobile app will launch in Q1 2018. BookiePro will first be made available as a desktop application, launching in Q4 2017.',
      question13: 'Who is the team behind BookiePro?',
      answer13: 'The development of BookiePro has been supported by the Peerplays Blockchain Standards Association (PBSA), ' +
      'a non-profit organization based in Canada and dedicated to promoting transparent and fair gaming standards for the Peerplays blockchain.',
    },
    license_screen:{
      title: 'MIT License',
      content:'<p> Copyright (c) 2017 Peerplays' +
      ' Blockchain Standards Association </p> ' +
      '<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in ' +
      'the Software without restriction, ' +
      'including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, ' +
      'and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, ' +
      'subject to the following conditions:</p>' +
      '<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>' +
      '<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING ' +
      'BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. ' +
      'IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, ' +
      'DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, ' +
      'TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>'
    },
    topbar_tooltip:{
      account_balance:"Available balance for betting ",
      account_name: "Account Name",
      my_bets: "My Bets",
      deposit: "Deposit",
      withdrawal: "Withdrawal",
      notification: "Notification",
      menu_more: "More"
    }
  }
};

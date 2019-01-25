import {ChainStore} from 'peerplaysjs-lib';

class AccountMemberService {
  /**
   * Get a Member status
   *
   * @param account
   * @returns {*}
   */
  static getAccountMemberStatus(account) {
    return ChainStore.getAccountMemberStatus(account);
  }
}

export default AccountMemberService;
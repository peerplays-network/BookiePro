import StorageService from "services/StorageService";
import Repository from 'repositories/chain/repository';

class AccountLoginService {

    /**
     * check at the start of the application if the user is logged in
     *
     * @param {string} accountName
     * @returns {Promise}
     */
    static checkLoginAccount(accountName = StorageService.get("currentAccount", null)) {

        return new Promise((resolve) => {

            if (accountName) {

                Repository.getAccount(accountName).then((account) => {

                    if (account) {
                        resolve({
                            id: account.get('id'),
                            name: account.get('name')
                        });
                    } else {
                        resolve(null);
                    }

                }).catch(() => {

                    resolve(null);

                });

            } else {

                resolve(null);

            }

        });

    }
}

export default AccountLoginService;

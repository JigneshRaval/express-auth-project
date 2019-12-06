import * as $ from 'jquery';

let sessionTimer;

export class UtilityService {

    constructor() {
        this.sessionCounter = 0;
        // Kept 15 minutes as a default expiryTime in config.json
        this.expiryTime = 2;
        this.defaultExpires = (this.expiryTime - 1) * 60 * 1000; // Expire counter 1 minute before the token expires
        if (!sessionStorage.getItem('sessionRenewCounter')) {

            sessionStorage.setItem('sessionRenewCounter', this.sessionCounter.toString());

        } else {
            this.sessionCounter = Number(sessionStorage.getItem('sessionRenewCounter'));
        }
    }

    resetSessionCounter() {
        this.sessionCounter = 0;
        sessionStorage.setItem('sessionRenewCounter', this.sessionCounter.toString());

        // Clear previously running timer
        clearInterval(sessionTimer);

        // Re-run function
        this.checkSessionExpiry();
    }

    checkSessionExpiry() {
        // Start timer to make a renewSession call on App init
        sessionTimer = setInterval(() => {
            const token = sessionStorage.getItem('token');

            try {
                if (token) {

                    this.sessionCounter += 1000;

                    if (this.sessionCounter >= this.defaultExpires) {

                        try {
                            this.sessionCounter = 0;
                            // this.remoteService.renewSession();

                            $('#exampleModal').modal('show');

                        } catch (error) {
                            this.sessionCounter = 0;
                        }
                    }
                    sessionStorage.setItem('sessionRenewCounter', this.sessionCounter.toString());
                } else {
                    clearInterval(sessionTimer);
                    sessionStorage.removeItem('sessionRenewCounter');
                }
            } catch (error) {
                clearInterval(sessionTimer);
                this.sessionCounter = 0;
            }
        }, 1000);
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

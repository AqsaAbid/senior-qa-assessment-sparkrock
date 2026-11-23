class LoginPage{
    constructor(page) {
        this.page = page;

        this.username = page.getByPlaceholder('Username');
        this.password = page.getByPlaceholder('Password');

        this.loginButton = page.locator(
            '[data-test="login-button"]'
        );
        this.error = page.locator(
            '[data-test="error"]'
        );
        
    }
    async open() {
        await this.page.goto('/');
    }
    async login(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }
}
module.exports = { LoginPage };

const { test, expect } = require('@playwright/test');

const {LoginPage} = require('../pages/LoginPage');
const {InventoryPage} = require('../pages/InventoryPage');
const {CheckoutPage} = require('../pages/CheckoutPage');

const validUser = {
    username: 'standard_user',
    password: 'secret_sauce'
};

test('TC-02: invalid password is rejected with an error', async({page}) => {
    const login = new LoginPage(page);
    await login.open();

    await login.login(
        validUser.username,
        'incorrect_password'
    );
    await expect(login.error).toBeVisible();
    await expect(login.error).toContainText(
        'Epic sadface: Username and password do not match any user in this service'
    );
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
});

test('TC-10: user can purchase a backpack successfully', async ({page}) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const checkout = new CheckoutPage(page);

    await login.open();
    await login.login(
        validUser.username,
        validUser.password
    );
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(inventory.title).toHaveText('Products');
    await inventory.addBackpackToCart();
    await expect(inventory.cartBadge).toHaveText('1');
    await inventory.openCart();
    await expect(page).toHaveURL(/cart\.html$/);
    await expect(checkout.cartItemName).toHaveText('Sauce Labs Backpack');
    await checkout.checkoutButton.click();
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    await checkout.enterCustomerInformation(
        'QA',
        'Candidate',
        '10001'
    );
    await expect(page).toHaveURL(/checkout-step-two\.html$/);
    await expect(checkout.cartItemName).toHaveText('Sauce Labs Backpack');
    await checkout.finishButton.click();
    await expect(page).toHaveURL(/checkout-complete\.html$/);
    await expect(checkout.completeHeader).toHaveText(
        'Thank you for your order!'
    );

})
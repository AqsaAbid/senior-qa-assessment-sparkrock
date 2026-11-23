
class CheckoutPage {
  constructor(page) {
    this.page = page;

    // Product name locator
    this.cartItemName = page.locator(
      '[data-test="inventory-item-name"]'
    ).filter({ hasText: 'Sauce Labs Backpack' });

    // Checkout button
    this.checkoutButton = page.locator(
      '[data-test="checkout"]'
    );

    // Customer information fields
    this.firstName = page.locator(
      '[data-test="firstName"]'
    );

    this.lastName = page.locator(
      '[data-test="lastName"]'
    );

    this.postalCode = page.locator(
      '[data-test="postalCode"]'
    );

    // Continue button
    this.continueButton = page.locator(
      '[data-test="continue"]'
    );

    // Finish order button
    this.finishButton = page.locator(
      '[data-test="finish"]'
    );

    // Order confirmation message
    this.completeHeader = page.locator(
      '[data-test="complete-header"]'
    );
  }

  // Enter checkout customer details
  async enterCustomerInformation(first, last, postal) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(postal);
    await this.continueButton.click();
  }
}

module.exports = { CheckoutPage };

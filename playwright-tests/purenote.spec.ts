import { test, expect } from "@playwright/test";

const purenoteUrl = "http://localhost:3002";

test("has title and logo", async ({ page }) => {
  await page.goto(purenoteUrl);

  await expect(page).toHaveTitle(/Pure Note/);

  const navbarBrand = page.locator('a.navbar-brand[href="/"]');
  await expect(navbarBrand).toBeVisible();

  const logoImage = navbarBrand.locator('img[src="/logo-name.png"]');
  await expect(logoImage).toBeVisible();
});

test("login", async ({ page }) => {
  await page.goto(purenoteUrl);

  await page.click('text="Login"');

  const email = "fengzhe1983+pntest1@gmail.com";
  const password = "XAX.pea!axe7ypz!nct";

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button:has-text("Login")');

  await expect(page.locator(`p:has-text("${email}")`)).toBeVisible();
});

test("register", async ({ page }) => {
  await page.goto(purenoteUrl);

  await page.click('text="Register"');

  const email = `fengzhe1983+pntest${Date.now()}tobedeleted@gmail.com`;
  const password = "test12__sdfsdaf*dtobedeleted";

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmpassword"]', password);
  await page.click('button:has-text("Register")');

  await expect(page.locator(`p:has-text("${email}")`)).toBeVisible();
});

import { test, expect } from '@playwright/test';

test.describe('网上购书系统 - 全业务流程测试', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  });

  test('1. 首页加载与图书展示测试', async ({ page }) => {
    await expect(page).toHaveTitle(/网上书店/);

    await expect(page.locator('.logo')).toContainText('Book');

    await expect(page.locator('nav.nav a')).toHaveCount(4);

    await expect(page.locator('.hero h1')).toBeVisible();

    await expect(page.locator('.book-card')).toHaveCount(12);

    await expect(page.locator('.book-card').first()).toBeVisible();

    await expect(page.locator('.search-box input')).toBeVisible();
  });

  test('2. 用户登录功能测试', async ({ page }) => {
    await page.click('button.login-btn');

    await expect(page.locator('.modal-container')).toBeVisible();
    await expect(page.locator('.modal-header h2')).toContainText('欢迎回来');

    await page.fill('.input-wrapper input[type="text"]', 'user');
    await page.fill('.input-wrapper input[type="password"]', '123456');

    await page.click('button.submit-btn');

    await expect(page.locator('.user-area span')).toContainText('user');
    await expect(page.locator('.user-area button')).toContainText('退出');
  });

  test('3. 登录失败 - 错误密码测试', async ({ page }) => {
    await page.click('button.login-btn');

    await page.fill('.input-wrapper input[type="text"]', 'user');
    await page.fill('.input-wrapper input[type="password"]', 'wrongpass');

    await page.click('button.submit-btn');

    await expect(page.locator('.msg.error')).toBeVisible();
    await expect(page.locator('.msg.error')).toContainText('密码错误');
  });

  test('4. 图书搜索功能测试', async ({ page }) => {
    const searchInput = page.locator('.search-box input');
    await searchInput.fill('Vue');
    await page.click('.search-btn');

    await expect(page.locator('.book-card')).toHaveCount(1);
    await expect(page.locator('.book-card h3').first()).toContainText('Vue.js 实战指南');

    await searchInput.fill('');
    await page.click('.search-btn');
    await expect(page.locator('.book-card')).toHaveCount(12);

    await searchInput.fill('三体');
    await searchInput.press('Enter');
    await expect(page.locator('.book-card h3').first()).toContainText('三体');
  });

  test('5. 分类浏览测试', async ({ page }) => {
    await page.click('nav.nav a:has-text("分类")');
    await expect(page).toHaveURL(/.*category/);

    await page.waitForSelector('.filter-bar');
    const categories = await page.locator('.filter-bar .filter-btn').count();
    expect(categories).toBeGreaterThan(0);

    await page.click('.filter-btn:has-text("科幻")');
    await expect(page.locator('.filter-btn.active')).toContainText('科幻');

    const techBooks = page.locator('.book-card');
    await expect(techBooks.first().locator('.book-category')).toContainText('科幻');
  });

  test('6. 图书详情页面测试', async ({ page }) => {
    const firstBook = page.locator('.book-card').first();
    const bookTitle = await firstBook.locator('h3').textContent();

    await firstBook.click();

    await expect(page).toHaveURL(/.*book\/\d+/);

    await expect(page.locator('.detail-info h1')).toContainText(bookTitle);
    await expect(page.locator('.price-value')).toBeVisible();
    await expect(page.locator('.add-cart-btn')).toBeVisible();

    await expect(page.locator('.quantity-selector')).toBeVisible();

    await page.click('.qty-btn:has-text("+")');
    await expect(page.locator('.qty-value')).toContainText('2');

    await page.click('.qty-btn:has-text("−")');
    await expect(page.locator('.qty-value')).toContainText('1');
  });

  test('7. 未登录加入购物车提示测试', async ({ page }) => {
    await page.locator('.book-card').first().hover();
    await page.locator('.book-card .quick-add').first().click();

    await expect(page.locator('.login-btn')).toBeVisible();
    await page.waitForTimeout(500);
  });

  test('8. 加入购物车流程测试', async ({ page }) => {
    await page.click('button.login-btn');
    await page.fill('.input-wrapper input[type="text"]', 'user');
    await page.fill('.input-wrapper input[type="password"]', '123456');
    await page.click('button.submit-btn');
    await page.waitForSelector('.user-area span');

    const firstBook = page.locator('.book-card').first();
    await firstBook.hover();
    await firstBook.locator('.quick-add').click();

    await expect(page.locator('nav a:has-text("购物车")')).toContainText('(1)');

    await firstBook.click();
    await page.waitForSelector('.add-cart-btn');

    await page.click('.qty-btn:has-text("+")');
    await page.click('.qty-btn:has-text("+")');
    await page.click('.add-cart-btn');

    await expect(page.locator('nav a:has-text("购物车")')).toContainText('(4)');
  });

  test('9. 购物车页面与数量调整测试', async ({ page }) => {
    await page.click('button.login-btn');
    await page.fill('.input-wrapper input[type="text"]', 'user');
    await page.fill('.input-wrapper input[type="password"]', '123456');
    await page.click('button.submit-btn');
    await page.waitForSelector('.user-area span');

    await page.locator('.book-card').nth(0).hover();
    await page.locator('.book-card').nth(0).locator('.quick-add').click();
    await page.waitForTimeout(300);
    await page.locator('.book-card').nth(1).hover();
    await page.locator('.book-card').nth(1).locator('.quick-add').click();

    await page.click('nav a:has-text("购物车")');
    await expect(page).toHaveURL(/.*cart/);

    await expect(page.locator('.cart-item')).toHaveCount(2);

    await expect(page.locator('.cart-summary')).toBeVisible();
    await expect(page.locator('.total-price')).toBeVisible();

    const firstItemQty = page.locator('.cart-item').first().locator('.item-quantity span');
    const initialQty = await firstItemQty.textContent();

    await page.locator('.cart-item').first().locator('button:has-text("+")').click();
    await expect(firstItemQty).not.toContainText(initialQty);

    await page.locator('.cart-item').first().locator('button:has-text("−")').click();

    await expect(page.locator('.checkout-btn')).toBeVisible();
  });

  test('10. 购物车删除商品测试', async ({ page }) => {
    await page.click('button.login-btn');
    await page.fill('.input-wrapper input[type="text"]', 'user');
    await page.fill('.input-wrapper input[type="password"]', '123456');
    await page.click('button.submit-btn');
    await page.waitForSelector('.user-area span');

    await page.locator('.book-card').nth(0).hover();
    await page.locator('.book-card').nth(0).locator('.quick-add').click();
    await page.waitForTimeout(300);
    await page.locator('.book-card').nth(1).hover();
    await page.locator('.book-card').nth(1).locator('.quick-add').click();

    await page.click('nav a:has-text("购物车")');
    await expect(page.locator('.cart-item')).toHaveCount(2);

    await page.locator('.cart-item').first().locator('.remove-btn').click();

    await expect(page.locator('.cart-item')).toHaveCount(1);
  });

  test('11. 完整购书下单流程测试', async ({ page }) => {
    await page.click('button.login-btn');
    await page.fill('.input-wrapper input[type="text"]', 'user');
    await page.fill('.input-wrapper input[type="password"]', '123456');
    await page.click('button.submit-btn');
    await page.waitForSelector('.user-area span');

    await page.locator('.book-card').nth(0).hover();
    await page.locator('.book-card').nth(0).locator('.quick-add').click();
    await page.waitForTimeout(300);
    await page.locator('.book-card').nth(3).hover();
    await page.locator('.book-card').nth(3).locator('.quick-add').click();

    await page.click('nav a:has-text("购物车")');
    await expect(page.locator('.cart-item')).toHaveCount(2);

    const totalPrice = await page.locator('.total-price').textContent();

    await page.click('.checkout-btn');

    await expect(page).toHaveURL(/.*orders/, { timeout: 10000 });

    await expect(page.locator('.order-card').first()).toBeVisible();
  });

  test('12. 订单列表页面测试', async ({ page }) => {
    await page.click('button.login-btn');
    await page.fill('.input-wrapper input[type="text"]', 'user');
    await page.fill('.input-wrapper input[type="password"]', '123456');
    await page.click('button.submit-btn');
    await page.waitForSelector('.user-area span');

    await page.locator('.book-card').nth(4).hover();
    await page.locator('.book-card').nth(4).locator('.quick-add').click();

    await page.click('nav a:has-text("购物车")');
    await page.click('.checkout-btn');
    await page.waitForURL(/.*orders/);

    await page.click('nav a:has-text("订单")');
    await expect(page).toHaveURL(/.*orders/);

    await expect(page.locator('.page-title')).toContainText('我的订单');

    await expect(page.locator('.order-card').first()).toBeVisible();

    await expect(page.locator('.order-id').first()).toBeVisible();
    await expect(page.locator('.order-status').first()).toBeVisible();
    await expect(page.locator('.total-amount').first()).toBeVisible();
  });

  test('13. 用户退出登录测试', async ({ page }) => {
    await page.click('button.login-btn');
    await page.fill('.input-wrapper input[type="text"]', 'user');
    await page.fill('.input-wrapper input[type="password"]', '123456');
    await page.click('button.submit-btn');
    await page.waitForSelector('.user-area span');

    await expect(page.locator('.user-area span')).toContainText('user');

    await page.click('.user-area button:has-text("退出")');

    await expect(page.locator('button.login-btn')).toBeVisible();
  });

  test('14. 新用户注册功能测试', async ({ page }) => {
    await page.click('button.login-btn');
    await page.click('.switch-mode a');

    await expect(page.locator('.modal-header h2')).toContainText('创建账号');

    const randomId = Math.floor(Math.random() * 10000);
    const newUser = `user${randomId}`;

    const formGroups = page.locator('.modal-form .form-group');

    await formGroups.nth(0).locator('input').fill(newUser);
    await formGroups.nth(1).locator('input').fill(`${newUser}@test.com`);
    await formGroups.nth(2).locator('input').fill('test123456');
    await formGroups.nth(3).locator('input').fill('test123456');

    await page.click('button.submit-btn');

    await expect(page.locator('.msg.success')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.msg.success')).toContainText('注册成功');
  });

  test('15. 空购物车状态测试', async ({ page }) => {
    await page.click('nav a:has-text("购物车")');

    await expect(page.locator('.empty-cart')).toBeVisible();
    await expect(page.locator('.empty-cart h2')).toContainText('购物车是空的');
    await expect(page.locator('.empty-cart a:has-text("开始购物")')).toBeVisible();
  });

  test('16. 购书完整端到端流程', async ({ page }) => {
    await test.step('Step 1: 访问首页', async () => {
      await expect(page.locator('.logo')).toBeVisible();
      await expect(page.locator('.book-card')).toHaveCount(12);
    });

    await test.step('Step 2: 用户登录', async () => {
      await page.click('button.login-btn');
      await page.fill('.input-wrapper input[type="text"]', 'user');
      await page.fill('.input-wrapper input[type="password"]', '123456');
      await page.click('button.submit-btn');
      await expect(page.locator('.user-area span')).toContainText('user');
    });

    await test.step('Step 3: 搜索并选择图书', async () => {
      await page.fill('.search-box input', '三体');
      await page.click('.search-btn');
      await expect(page.locator('.book-card')).toHaveCount(1);
      await page.locator('.book-card').first().click();
      await expect(page.locator('.detail-info h1')).toContainText('三体');
    });

    await test.step('Step 4: 调整数量并加入购物车', async () => {
      await page.click('.qty-btn:has-text("+")');
      await page.click('.qty-btn:has-text("+")');
      await expect(page.locator('.qty-value')).toContainText('3');
      await page.click('.add-cart-btn');
      await expect(page.locator('nav a:has-text("购物车")')).toContainText('(3)');
    });

    await test.step('Step 5: 进入购物车确认', async () => {
      await page.click('nav a:has-text("购物车")');
      await expect(page.locator('.cart-item')).toHaveCount(1);
      await expect(page.locator('.item-quantity span')).toContainText('3');
    });

    await test.step('Step 6: 结算下单', async () => {
      await page.click('.checkout-btn');
      await expect(page).toHaveURL(/.*orders/);
    });

    await test.step('Step 7: 验证订单创建', async () => {
      await expect(page.locator('.order-card').first()).toBeVisible();
      await expect(page.locator('.order-item').first()).toContainText('三体');
      await expect(page.locator('.item-qty').first()).toContainText('x3');
    });

    await test.step('Step 8: 返回首页继续购物', async () => {
      await page.click('nav a:has-text("发现")');
      await expect(page.locator('.book-card')).toHaveCount(12);
    });
  });

});

const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

test.describe('网上购书系统 - 全业务流程自动化测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC01 - 首页加载与基础元素展示', async ({ page }) => {
    await expect(page).toHaveTitle(/网上书店/);

    await expect(page.getByRole('link', { name: 'Book' })).toBeVisible();
    await expect(page.getByRole('link', { name: '发现' })).toBeVisible();
    await expect(page.getByRole('link', { name: '分类' })).toBeVisible();
    await expect(page.getByRole('link', { name: /购物车/ })).toBeVisible();
    await expect(page.getByRole('link', { name: '订单' })).toBeVisible();
    await expect(page.getByRole('button', { name: '登录' })).toBeVisible();

    await expect(page.getByRole('heading', { name: /探索阅读的/ })).toBeVisible();

    const bookCards = page.locator('.book-card');
    expect(await bookCards.count()).toBeGreaterThan(0);

    await expect(page.getByRole('heading', { name: '精选推荐' })).toBeVisible();
    await expect(page.getByRole('link', { name: '查看全部' })).toBeVisible();
  });

  test('TC02 - 图书搜索功能', async ({ page }) => {
    const searchInput = page.getByPlaceholder('搜索书名、作者...');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Vue');
    await page.locator('.search-btn').click();
    await page.waitForTimeout(500);

    const booksAfterSearch = page.locator('.book-card');
    const count = await booksAfterSearch.count();

    let foundVue = false;
    for (let i = 0; i < count; i++) {
      const title = await booksAfterSearch.nth(i).locator('h3').textContent();
      if (title && title.includes('Vue')) {
        foundVue = true;
        break;
      }
    }
    expect(foundVue).toBe(true);
  });

  test('TC03 - 分类页面导航', async ({ page }) => {
    await page.getByRole('link', { name: '分类' }).click();
    await page.waitForURL('**/category');
    await expect(page).toHaveURL(/category/);
  });

  test('TC04 - 用户登录成功流程', async ({ page }) => {
    await page.getByRole('button', { name: '登录' }).click();

    const modal = page.locator('.modal-container');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { name: '欢迎回来' })).toBeVisible();

    await page.locator('input[type="text"]').fill('user');
    await page.locator('input[type="password"]').first().fill('123456');
    await modal.getByRole('button', { name: '登录' }).click();

    await expect(page.getByRole('button', { name: '退出' })).toBeVisible();
    await expect(page.getByText('user')).toBeVisible();
    await expect(page.getByRole('button', { name: '登录' })).not.toBeVisible();
  });

  test('TC05 - 用户登录失败（错误密码）', async ({ page }) => {
    await page.getByRole('button', { name: '登录' }).click();

    const modal = page.locator('.modal-container');
    await page.locator('input[type="text"]').fill('user');
    await page.locator('input[type="password"]').first().fill('wrongpass');
    await modal.getByRole('button', { name: '登录' }).click();

    await expect(page.locator('.msg.error')).toBeVisible();
    await expect(modal).toBeVisible();
  });

  test('TC06 - 图书详情页展示', async ({ page }) => {
    const firstBookTitle = await page.locator('.book-card h3').first().textContent();

    await page.locator('.book-card').first().click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1')).toContainText(firstBookTitle.trim());
    await expect(page.locator('.detail-author')).toBeVisible();
    await expect(page.locator('.price-value')).toBeVisible();
    await expect(page.locator('.detail-desc')).toBeVisible();
    await expect(page.locator('.add-cart-btn')).toBeVisible();
  });

  test('TC07 - 未登录添加商品弹出登录框', async ({ page }) => {
    await page.locator('.book-card').first().hover();
    await page.locator('.book-card .quick-add').first().click();

    await expect(page.locator('.modal-container')).toBeVisible();
  });

  test('TC08 - 首页添加商品到购物车', async ({ page }) => {
    await page.getByRole('button', { name: '登录' }).click();
    await page.locator('input[type="text"]').fill('user');
    await page.locator('input[type="password"]').first().fill('123456');
    await page.locator('.modal-container').getByRole('button', { name: '登录' }).click();
    await page.waitForTimeout(500);

    const initialCartText = await page.getByRole('link', { name: /购物车/ }).textContent();
    const initialCount = parseInt((initialCartText.match(/\((\d+)\)/) || [, '0'])[1]);

    await page.locator('.book-card').nth(0).hover();
    await page.locator('.book-card').nth(0).locator('.quick-add').click();
    await page.waitForTimeout(800);

    const newCartText = await page.getByRole('link', { name: /购物车/ }).textContent();
    const newCount = parseInt((newCartText.match(/\((\d+)\)/) || [, '0'])[1]);
    expect(newCount).toBe(initialCount + 1);
  });

  test('TC09 - 购物车页面展示', async ({ page }) => {
    await page.getByRole('button', { name: '登录' }).click();
    await page.locator('input[type="text"]').fill('user');
    await page.locator('input[type="password"]').first().fill('123456');
    await page.locator('.modal-container').getByRole('button', { name: '登录' }).click();
    await page.waitForTimeout(500);

    await page.locator('.book-card').nth(0).hover();
    await page.locator('.book-card').nth(0).locator('.quick-add').click();
    await page.waitForTimeout(500);

    await page.getByRole('link', { name: /购物车/ }).click();
    await page.waitForURL('**/cart');

    await expect(page.locator('.page-title')).toContainText('购物车');
    await expect(page.locator('.cart-item')).toHaveCount(1);
    await expect(page.locator('.cart-summary')).toBeVisible();
    await expect(page.locator('.checkout-btn')).toBeVisible();
  });

  test('TC10 - 购物车修改商品数量', async ({ page }) => {
    await page.getByRole('button', { name: '登录' }).click();
    await page.locator('input[type="text"]').fill('user');
    await page.locator('input[type="password"]').first().fill('123456');
    await page.locator('.modal-container').getByRole('button', { name: '登录' }).click();
    await page.waitForTimeout(500);

    await page.locator('.book-card').nth(0).hover();
    await page.locator('.book-card').nth(0).locator('.quick-add').click();
    await page.waitForTimeout(500);

    await page.getByRole('link', { name: /购物车/ }).click();
    await page.waitForURL('**/cart');

    const firstItem = page.locator('.cart-item').first();
    const qtyBefore = await firstItem.locator('.item-quantity span').textContent();

    await firstItem.locator('.qty-btn').nth(1).click();
    await page.waitForTimeout(300);

    const qtyAfter = await firstItem.locator('.item-quantity span').textContent();
    expect(parseInt(qtyAfter)).toBe(parseInt(qtyBefore) + 1);
  });

  test('TC11 - 购物车删除商品', async ({ page }) => {
    await page.getByRole('button', { name: '登录' }).click();
    await page.locator('input[type="text"]').fill('user');
    await page.locator('input[type="password"]').first().fill('123456');
    await page.locator('.modal-container').getByRole('button', { name: '登录' }).click();
    await page.waitForTimeout(500);

    await page.locator('.book-card').nth(0).hover();
    await page.locator('.book-card').nth(0).locator('.quick-add').click();
    await page.waitForTimeout(500);

    await page.getByRole('link', { name: /购物车/ }).click();
    await page.waitForURL('**/cart');

    await expect(page.locator('.cart-item')).toHaveCount(1);

    await page.locator('.remove-btn').first().click();
    await page.waitForTimeout(500);

    await expect(page.locator('.empty-cart')).toBeVisible();
  });

  test('TC12 - 订单结算与创建', async ({ page }) => {
    await page.getByRole('button', { name: '登录' }).click();
    await page.locator('input[type="text"]').fill('user');
    await page.locator('input[type="password"]').first().fill('123456');
    await page.locator('.modal-container').getByRole('button', { name: '登录' }).click();
    await page.waitForTimeout(500);

    const firstBookTitle = await page.locator('.book-card h3').first().textContent();

    await page.locator('.book-card').nth(0).hover();
    await page.locator('.book-card').nth(0).locator('.quick-add').click();
    await page.waitForTimeout(500);

    await page.getByRole('link', { name: /购物车/ }).click();
    await page.waitForURL('**/cart');

    await expect(page.locator('.checkout-btn')).toBeVisible();
    await page.locator('.checkout-btn').click();

    await page.waitForURL('**/orders', { timeout: 10000 });
    await expect(page).toHaveURL(/orders/);

    const firstOrder = page.locator('.order-card').first();
    await expect(firstOrder).toBeVisible();
    await expect(firstOrder.locator('.order-status')).toContainText('待发货');

    const orderBookTitle = await firstOrder.locator('.order-item h4').first().textContent();
    expect(orderBookTitle.trim()).toBe(firstBookTitle.trim());
  });

  test('TC13 - 订单页面详情验证', async ({ page }) => {
    await page.getByRole('button', { name: '登录' }).click();
    await page.locator('input[type="text"]').fill('user');
    await page.locator('input[type="password"]').first().fill('123456');
    await page.locator('.modal-container').getByRole('button', { name: '登录' }).click();
    await page.waitForTimeout(500);

    await page.locator('.book-card').nth(0).hover();
    await page.locator('.book-card').nth(0).locator('.quick-add').click();
    await page.waitForTimeout(500);

    await page.getByRole('link', { name: /购物车/ }).click();
    await page.waitForURL('**/cart');
    await page.locator('.checkout-btn').click();
    await page.waitForURL('**/orders', { timeout: 10000 });

    const orderCard = page.locator('.order-card').first();
    await expect(orderCard.locator('.order-id')).toBeVisible();
    await expect(orderCard.locator('.order-time')).toBeVisible();
    await expect(orderCard.locator('.order-items')).toBeVisible();
    await expect(orderCard.locator('.total-amount')).toBeVisible();
    await expect(orderCard.locator('.items-count')).toBeVisible();
  });

  test('TC14 - 购物车清空后显示空状态', async ({ page }) => {
    await page.getByRole('button', { name: '登录' }).click();
    await page.locator('input[type="text"]').fill('user');
    await page.locator('input[type="password"]').first().fill('123456');
    await page.locator('.modal-container').getByRole('button', { name: '登录' }).click();
    await page.waitForTimeout(500);

    await page.locator('.book-card').nth(0).hover();
    await page.locator('.book-card').nth(0).locator('.quick-add').click();
    await page.waitForTimeout(500);

    await page.getByRole('link', { name: /购物车/ }).click();
    await page.waitForURL('**/cart');

    await page.locator('.remove-btn').click();
    await page.waitForTimeout(300);

    await expect(page.locator('.empty-cart')).toBeVisible();
    await expect(page.getByRole('link', { name: '开始购物' })).toBeVisible();
  });

  test('TC15 - 用户退出登录', async ({ page }) => {
    await page.getByRole('button', { name: '登录' }).click();
    await page.locator('input[type="text"]').fill('user');
    await page.locator('input[type="password"]').first().fill('123456');
    await page.locator('.modal-container').getByRole('button', { name: '登录' }).click();
    await page.waitForTimeout(500);

    await expect(page.getByRole('button', { name: '退出' })).toBeVisible();
    await page.getByRole('button', { name: '退出' }).click();
    await page.waitForTimeout(500);

    await expect(page.getByRole('button', { name: '登录' })).toBeVisible();
  });

  test('TC16 - 购书完整业务流程端到端测试', async ({ page }) => {
    test.setTimeout(90000);

    console.log('\n=== 开始完整购书流程端到端测试 ===\n');

    await expect(page.getByRole('heading', { name: /探索阅读的/ })).toBeVisible();
    console.log('✅ 步骤 1/12: 首页加载成功');

    await page.getByRole('button', { name: '登录' }).click();
    await page.locator('input[type="text"]').fill('user');
    await page.locator('input[type="password"]').first().fill('123456');
    await page.locator('.modal-container').getByRole('button', { name: '登录' }).click();
    await page.waitForTimeout(800);
    await expect(page.getByText('user')).toBeVisible();
    console.log('✅ 步骤 2/12: 用户登录成功 (user/123456)');

    const firstBookCard = page.locator('.book-card').first();
    const selectedBookTitle = await firstBookCard.locator('h3').textContent();
    const selectedBookPrice = await firstBookCard.locator('.book-price').textContent();
    console.log(`✅ 步骤 3/12: 选择图书《${selectedBookTitle.trim()}》- 价格: ${selectedBookPrice}`);

    await firstBookCard.hover();
    await firstBookCard.locator('.quick-add').click();
    await page.waitForTimeout(1000);
    console.log('✅ 步骤 4/12: 添加图书到购物车');

    const cartLink = page.getByRole('link', { name: /购物车/ });
    const cartCountText = await cartLink.textContent();
    const cartCount = parseInt((cartCountText.match(/\((\d+)\)/) || [, '0'])[1]);
    expect(cartCount).toBeGreaterThanOrEqual(1);
    console.log(`✅ 步骤 5/12: 购物车商品数量验证: ${cartCount} 件`);

    await cartLink.click();
    await page.waitForURL('**/cart');
    await page.waitForLoadState('domcontentloaded');
    console.log('✅ 步骤 6/12: 进入购物车页面');

    const cartItem = page.locator('.cart-item').first();
    await expect(cartItem).toBeVisible();
    const cartItemTitle = await cartItem.locator('h3').textContent();
    expect(cartItemTitle.trim()).toBe(selectedBookTitle.trim());
    console.log(`✅ 步骤 7/12: 购物车商品验证正确《${cartItemTitle.trim()}》`);

    const orderTotal = await page.locator('.total-price').textContent();
    console.log(`✅ 步骤 8/12: 订单金额确认: ${orderTotal}`);

    await expect(page.locator('.checkout-btn')).toBeEnabled();
    await page.locator('.checkout-btn').click();
    await page.waitForURL('**/orders', { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded');
    console.log('✅ 步骤 9/12: 提交订单成功，跳转至订单页面');

    await expect(page).toHaveURL(/orders/);
    const newOrder = page.locator('.order-card').first();
    await expect(newOrder).toBeVisible();

    const orderId = await newOrder.locator('.order-id').textContent();
    const orderStatus = await newOrder.locator('.order-status').textContent();
    const orderTotalAmount = await newOrder.locator('.total-amount').textContent();

    expect(orderStatus).toBe('待发货');
    console.log(`✅ 步骤 10/12: 订单创建成功 - ${orderId}, 状态: ${orderStatus}, 金额: ${orderTotalAmount}`);

    const orderBookName = await newOrder.locator('.order-item h4').first().textContent();
    expect(orderBookName.trim()).toBe(selectedBookTitle.trim());
    console.log(`✅ 步骤 11/12: 订单商品明细验证正确《${orderBookName.trim()}》`);

    const emptyCartText = await page.getByRole('link', { name: /购物车/ }).textContent();
    expect(emptyCartText).toContain('(0)');
    console.log('✅ 步骤 12/12: 购物车已清空');

    console.log('\n=== 🎉 完整购书业务流程测试全部通过！ ===\n');
  });

  test('TC17 - 多商品批量购书流程测试', async ({ page }) => {
    test.setTimeout(90000);

    await page.getByRole('button', { name: '登录' }).click();
    await page.locator('input[type="text"]').fill('user');
    await page.locator('input[type="password"]').first().fill('123456');
    await page.locator('.modal-container').getByRole('button', { name: '登录' }).click();
    await page.waitForTimeout(500);

    for (let i = 0; i < 3; i++) {
      await page.locator('.book-card').nth(i).hover();
      await page.locator('.book-card').nth(i).locator('.quick-add').click();
      await page.waitForTimeout(400);
    }

    await page.getByRole('link', { name: /购物车/ }).click();
    await page.waitForURL('**/cart');

    const cartItems = page.locator('.cart-item');
    expect(await cartItems.count()).toBe(3);

    await page.locator('.checkout-btn').click();
    await page.waitForURL('**/orders', { timeout: 15000 });

    const order = page.locator('.order-card').first();
    expect(await order.locator('.order-item').count()).toBe(3);
  });

  test('TC18 - 用户注册密码不一致验证', async ({ page }) => {
    test.setTimeout(30000);

    await page.getByRole('button', { name: '登录' }).click();

    const modal = page.locator('.modal-container');
    await modal.getByText('立即注册').click();
    await page.waitForTimeout(500);

    await expect(modal.getByRole('heading', { name: '创建账号' })).toBeVisible();

    const inputs = modal.locator('input');
    await inputs.nth(0).fill('newuser');
    await inputs.nth(1).fill('newuser@example.com');
    await inputs.nth(2).fill('password1');
    await inputs.nth(3).fill('password2');

    await modal.getByRole('button', { name: '注册' }).click();
    await page.waitForTimeout(500);

    const errorMsg = modal.locator('.msg.error');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('密码不一致');

    console.log('✅ 用户注册密码不一致验证通过');
  });
});

import { expect, Locator, Page } from "@playwright/test";

export type NavigationTarget = {
  menuName: string;
  subMenuName?: string;
  menuKey?: string;
  verify: {
    urlContains?: string;
    heading?: string;
  };
};

export class GitLabHomePage {
  private readonly baseUrl = "https://about.gitlab.com/";
  private readonly primaryNav: Locator;

  constructor(private page: Page) {
    this.primaryNav = this.page.getByRole("navigation").first();
  }

  async goto(): Promise<void> {
    await this.page.goto(this.baseUrl, { waitUntil: "domcontentloaded" });
  }

  async navigateToSubMenu(target: NavigationTarget): Promise<void> {
    const trigger = this.menuTrigger(target.menuName);
    if (!target.subMenuName) {
      await trigger.waitFor({ state: "visible" });
      await trigger.click();
      await this.verifyNavigation(target);
      return;
    }

    const subItem = this.subMenuLink(target.subMenuName, target.menuKey);

    await trigger.waitFor({ state: "visible" });
    await trigger.hover();

    try {
      await expect(subItem).toBeVisible({ timeout: 2000 });
    } catch {
      await trigger.click();
      await expect(subItem).toBeVisible();
    }

    await subItem.click();

    await this.verifyNavigation(target);
  }

  private async verifyNavigation(target: NavigationTarget): Promise<void> {
    if (target.verify.urlContains) {
      const escaped = target.verify.urlContains.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      await expect(this.page).toHaveURL(new RegExp(escaped));
    }

    if (target.verify.heading) {
      await expect(this.page.getByRole("heading", { name: target.verify.heading })).toBeVisible();
    }
  }

  async returnToHome(): Promise<void> {
    await this.page.goto(this.baseUrl, { waitUntil: "domcontentloaded" });
  }

  async openGetFreeTrialFromHeader(): Promise<void> {
    const getFreeTrialLink = this.page
      .locator(
        'header a:has-text("Get free trial"), header a[name="Get free trial"], header a[data-ga-name="free trial" i]'
      )
      .or(this.page.getByRole("link", { name: /get free trial/i }))
      .or(this.page.getByRole("button", { name: /get free trial/i }));

    await getFreeTrialLink.first().waitFor({ state: "visible" });
    await getFreeTrialLink.first().click();
    await expect(this.page).toHaveURL(
      /https:\/\/gitlab\.com\/-\/trial_registrations\/new\?glm_source=about\.gitlab\.com\/(sales)?&glm_content=default-saas-trial/i
    );
  }

  async fillGetFreeTrialForm(): Promise<void> {
    await this.page.getByRole("textbox", { name: "First name" }).fill("John");
    await this.page.getByRole("textbox", { name: "Last name" }).fill("Smith");
    await this.page.getByRole("textbox", { name: "Username" }).fill("JohnSmith");
    await this.page.getByRole("textbox", { name: "Company email" }).fill("johnsmith@example.com");
    await this.page.getByRole("textbox", { name: "Password" }).fill("MyPassword123!");

    const optInCheckbox = this.page.locator("#new_user_onboarding_status_email_opt_in");
    await this.page.locator('label[for="new_user_onboarding_status_email_opt_in"]').click();
    await expect(optInCheckbox).toBeChecked();
    await this.page.locator('label[for="new_user_onboarding_status_email_opt_in"]').click();
    await expect(optInCheckbox).not.toBeChecked();

    await this.page.getByRole("button", { name: "Show password" }).click();
    await this.page.getByRole("button", { name: "Hide password" }).click();

    await this.page.locator("button.gl-new-dropdown-toggle").click();
    await this.page.getByRole("option", { name: "Irish" }).click();
    await expect(
      this.page.locator("button.gl-new-dropdown-toggle .gl-new-dropdown-button-text")
    ).toContainText("Irish");
    await this.page.locator("button.gl-new-dropdown-toggle").click();
    await this.page.getByRole("option", { name: "English" }).click();
    await expect(
      this.page.locator("button.gl-new-dropdown-toggle .gl-new-dropdown-button-text")
    ).toContainText("English");
  }

  private menuTrigger(menuName: string): Locator {
    return this.primaryNav
      .getByRole("button", { name: menuName })
      .or(this.primaryNav.getByRole("link", { name: menuName }));
  }

  private subMenuLink(subMenuName: string, menuKey?: string): Locator {
    if (menuKey) {
      return this.page
        .locator(`a[data-nav-levelone="${menuKey}"]`, { hasText: subMenuName })
        .or(this.page.locator(`[data-nav-levelone="${menuKey}"]`).filter({ hasText: subMenuName }))
        .first();
    }

    return this.primaryNav
      .getByRole("link", { name: subMenuName })
      .or(this.primaryNav.getByText(subMenuName, { exact: true }))
      .or(this.page.getByRole("link", { name: subMenuName }))
      .or(this.page.getByText(subMenuName, { exact: true }))
      .first();
  }
}

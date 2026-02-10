import { Page, test } from "@playwright/test";
import { GitLabHomePage, NavigationTarget } from "./pages/gitlabHomePage";

test.describe("GitLab public site smoke navigation", () => {
  const acceptCookies = async (page: Page) => {
    const cookieButton = page.locator("#onetrust-accept-btn-handler");
    try {
      await cookieButton.waitFor({ state: "visible", timeout: 2000 });
      await cookieButton.click();
      return;
    } catch {
      const consentFrames = page.frameLocator(
        'iframe[id*="onetrust"], iframe[src*="onetrust"], iframe[title*="trust" i], iframe[title*="consent" i]'
      );
      const cookieButtonInFrame = consentFrames.locator("#onetrust-accept-btn-handler");
      try {
        await cookieButtonInFrame.waitFor({ state: "visible", timeout: 2000 });
        await cookieButtonInFrame.click();
      } catch {
        // Cookie banner not shown in this session.
      }
    }
  };

  test("top navigation menus route correctly", async ({ page }) => {
    const home = new GitLabHomePage(page);

    const targets: NavigationTarget[] = [
      {
        menuName: "Platform",
        subMenuName: "Learn more",
        menuKey: "platform",
        verify: { urlContains: "/why-gitlab/" },
      },
      {
        menuName: "Product",
        subMenuName: "Enterprise",
        menuKey: "solutions",
        verify: { urlContains: "/enterprise/" },
      },
      {
        menuName: "Pricing",
        verify: { urlContains: "/pricing/" },
      },
      {
        menuName: "Resources",
        subMenuName: "View all resources",
        menuKey: "resources",
        verify: { urlContains: "/resources/" },
      },
      {
        menuName: "Company",
        subMenuName: "About",
        menuKey: "company",
        verify: { urlContains: "/company/" },
      },
    ];

    await home.goto();
    await acceptCookies(page);

    for (const target of targets) {
      await home.navigateToSubMenu(target);
      await home.returnToHome();
    }

    await home.goto();
    await acceptCookies(page);
    await home.openGetFreeTrialFromHeader();
    await home.fillGetFreeTrialForm();
  });
});

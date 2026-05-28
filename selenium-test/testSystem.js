
const { Builder, By, until } = require("selenium-webdriver");
const edge = require("selenium-webdriver/edge");

async function testSystem() {

    let driver = await new Builder()
        .forBrowser("MicrosoftEdge")
        .setEdgeOptions(new edge.Options())
        .build();

    try {
        const URL = process.env.FRONTEND_URL || "http://localhost:5400/";
        await driver.get(URL);

        console.log("Page loaded:", await driver.getCurrentUrl());

        // locate elements
        const eauEl = await driver.findElement(By.id("eau"));
        const elecEl = await driver.findElement(By.id("electricite"));
        const btn = await driver.findElement(By.id("btn"));

        // 🧠 STEP 1: BEFORE CLICK (MUST BE EMPTY)
        let beforeEau = await eauEl.getAttribute("value");
        console.log("Before click eau:", beforeEau);

        if (beforeEau !== "") {
            throw new Error("UI is NOT empty at start ❌");
        }

        // 🟡 CLICK BUTTON
        console.log("Clicking button...");
        await btn.click();

        // 🧠 STEP 2: WAIT FOR CHANGE (IMPORTANT)
        await driver.wait(async () => {
            let val = await eauEl.getAttribute("value");
            return val && val !== "" && val !== "Loading...";
        }, 10000);

        // 🧠 STEP 3: READ FINAL VALUES
        const valueEau = await eauEl.getAttribute("value");
        const valueElec = await elecEl.getAttribute("value");

        console.log("After click eau:", valueEau);
        console.log("After click elec:", valueElec);

        // ASSERTIONS
        if (!valueEau || !valueElec) {
            throw new Error("Test FAILED: empty values");
        }

        console.log("TEST PASSED ✔");

        await driver.sleep(5000);

    } catch (err) {
        console.error("TEST FAILED ❌", err);
    } finally {
        await driver.quit();
    }
}

testSystem();
export async function getJson(url) {
    let res = await fetch(url, { method: "GET", credentials: "include" });
    return res.json();
}
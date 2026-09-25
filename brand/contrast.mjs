/** Calculate WCAG 2.x contrast from sRGB channel values. Run with node. */
const colors = {
  ivory: "#F8F7F2",
  paper: "#FFFFFF",
  green: "#174C3C",
  "green-deep": "#0F372B",
  ink: "#1D2924",
  muted: "#526259",
  soft: "#E8EFE6",
  rule: "#D5DDD4",
};

function luminance(hex) {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const linear = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

for (const [foreground, background] of [
  ["green", "ivory"],
  ["ivory", "green"],
  ["ink", "ivory"],
  ["muted", "ivory"],
  ["green", "soft"],
  ["ink", "soft"],
  ["muted", "soft"],
  ["rule", "ivory"],
]) {
  const a = luminance(colors[foreground]);
  const b = luminance(colors[background]);
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  console.log(`${foreground}/${background}: ${ratio.toFixed(2)}:1 | 4.5 ${ratio >= 4.5 ? "pass" : "fail"} | 3 ${ratio >= 3 ? "pass" : "fail"}`);
}

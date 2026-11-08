export const GAME_REQUIREMENTS = {
  1: { title: "Valorant", cpuTier: 5, cpuCores: 2, gpuRank: 18, gpuLabel: "Intel HD 4000 / Radeon R5 200 class", ramGB: 4, storageGB: 30 },
  2: { title: "Call of Duty", cpuTier: 5, cpuCores: 4, gpuRank: 48, gpuLabel: "GTX 960 / RX 470 / Arc A580 class", ramGB: 8, storageGB: 128 },
  3: { title: "Dead by Daylight", cpuTier: 3, cpuCores: 2, gpuRank: 20, gpuLabel: "GTX 460 / Radeon HD 6850 class", ramGB: 8, storageGB: 50 },
  4: { title: "CSGO", cpuTier: 5, cpuCores: 2, gpuRank: 15, gpuLabel: "DirectX 11 compatible", ramGB: 8, storageGB: 85 },
  5: { title: "GTA V", cpuTier: 7, cpuCores: 4, gpuRank: 58, gpuLabel: "GTX 1630 / RX 6400 class", ramGB: 8, storageGB: 105 },
  6: { title: "Minecraft", cpuTier: 3, cpuCores: 4, gpuRank: 42, gpuLabel: "GTX 950 / RX 460 class", ramGB: 12, storageGB: 4 },
  7: { title: "Photoshop", cpuTier: 3, cpuCores: 4, gpuRank: 20, gpuLabel: "DirectX 12 compatible", ramGB: 8, storageGB: 10 },
  8: { title: "Premiere Pro", cpuTier: 5, cpuCores: 4, gpuRank: 25, gpuLabel: "2 GB VRAM class", ramGB: 8, storageGB: 8 },
  9: { title: "VS Code", cpuTier: 0, cpuCores: 1, gpuRank: 10, gpuLabel: "Basic DirectX 10 compatible", ramGB: 1, storageGB: 0.5 },
  10: { title: "Figma", cpuTier: 0, cpuCores: 2, gpuRank: 10, gpuLabel: "Browser hardware acceleration", ramGB: 8, storageGB: 1 },
  11: { title: "Blender", cpuTier: 0, cpuCores: 4, gpuRank: 20, gpuLabel: "2 GB VRAM class", ramGB: 8, storageGB: 2 },
  12: { title: "Unity Engine", cpuTier: 0, cpuCores: 4, gpuRank: 20, gpuLabel: "DirectX 10 compatible", ramGB: 8, storageGB: 10 },
  13: { title: "Unreal Engine", cpuTier: 0, cpuCores: 4, gpuRank: 70, gpuLabel: "DirectX 12 GPU, 8 GB VRAM class", ramGB: 32, storageGB: 10 },
  14: { title: "Spotify", cpuTier: 0, cpuCores: 2, gpuRank: 5, gpuLabel: "Integrated graphics", ramGB: 4, storageGB: 1 },
  15: { title: "Discord", cpuTier: 0, cpuCores: 2, gpuRank: 10, gpuLabel: "Browser acceleration", ramGB: 4, storageGB: 0.5 },
};

export function cpuTierOf(value) {
  const cpu = String(value ?? "").toLowerCase();
  const tiers = [
    ...[...cpu.matchAll(/\bi\s*([3579])\b/g)].map((match) => Number(match[1])),
    ...[...cpu.matchAll(/\bryzen\s*([3579])\b/g)].map((match) => Number(match[1])),
    ...[...cpu.matchAll(/\bcore\s+ultra\s*([579])\b/g)].map((match) => Number(match[1])),
  ];

  if (tiers.length) return Math.max(...tiers);
  if (/\bfx\s*-?\s*9\d{3}\b/.test(cpu)) return 7;
  if (/\bfx\s*-?\s*\d{4}\b/.test(cpu)) return 5;
  if (/\bathlon\b/.test(cpu)) return 3;
  if (/\bceleron\b|\bpentium\b/.test(cpu)) return 1;
  return null;
}

export function cpuCoresOf(value) {
  const cpu = String(value ?? "").toLowerCase();
  const explicit = cpu.match(/\b(\d+)\s*(?:-\s*)?cores?\b/);
  if (explicit) return Number(explicit[1]);

  const intel = cpu.match(/\bi([3579])\s*-?\s*(\d{3,5})[a-z]*\b/);
  if (intel) {
    const tier = Number(intel[1]);
    const model = Number(intel[2]);
    const generation = intel[2].length >= 5
      ? Math.floor(model / 1000)
      : Math.floor(model / 100);
    if (generation >= 12) return ({ 3: 4, 5: 10, 7: 12, 9: 16 })[tier];
    if (generation >= 8) return ({ 3: 4, 5: 6, 7: 8, 9: 10 })[tier];
    return ({ 3: 2, 5: 4, 7: 4, 9: 6 })[tier];
  }

  const ryzen = cpu.match(/\bryzen\s*([3579])\b/);
  if (ryzen) return ({ 3: 4, 5: 6, 7: 8, 9: 12 })[Number(ryzen[1])];

  const fx = cpu.match(/\bfx\s*-?\s*(\d{4})\b/);
  if (fx) return Math.max(4, Math.min(8, Number(fx[1][0])));
  if (/\bathlon\s*200ge\b/.test(cpu)) return 2;
  return null;
}

export function gpuRankOf(value) {
  const gpu = String(value ?? "").toLowerCase();
  if (!gpu.trim()) return null;

  const rtx = gpu.match(/\brtx\s*(\d{4})\b/);
  if (rtx) {
    const model = Number(rtx[1]);
    const series = Math.floor(model / 1000);
    const classRank = Math.floor((model % 1000) / 100);
    return 50 + series * 10 + classRank * 2;
  }

  const gtx = gpu.match(/\bgtx\s*(\d{3,4})\b/);
  if (gtx) {
    const model = Number(gtx[1]);
    if (model >= 1600) return model >= 1660 ? 65 : 58;
    if (model >= 1000) return model >= 1060 ? 58 : model >= 1050 ? 50 : 45;
    if (model >= 900) return model >= 960 ? 48 : 42;
    if (model >= 700) return 32;
    return 20;
  }

  const arc = gpu.match(/\barc\s*a(\d{3})\b/);
  if (arc) return Number(arc[1]) >= 700 ? 75 : Number(arc[1]) >= 500 ? 65 : 50;

  const radeon = gpu.match(/\brx\s*(\d{3,4})\b/);
  if (radeon) {
    const model = Number(radeon[1]);
    if (model >= 7000) return 80;
    if (model >= 6000) return 68;
    if (model >= 5000) return 58;
    if (model >= 400) return 48;
    return 30;
  }

  const radeonHD = gpu.match(/\bradeon\s*hd\s*(\d{3,4})\b/);
  if (radeonHD) {
    const model = Number(radeonHD[1]);
    if (model >= 6000) return 20;
    if (model >= 5000) return 18;
    return 15;
  }

  if (/\b(radeon\s*r\d|intel\s*(?:hd|uhd|iris)|integrated|onboard|on-board|vega\s*\d)/.test(gpu)) return 18;
  if (/directx\s*12/.test(gpu)) return 20;
  if (/directx|browser|accelerat|onboard|integrated/.test(gpu)) return 15;
  return null;
}

export function ramGBOf(value) {
  const text = String(value ?? "");
  const modules = text.match(/(\d+)\s*x\s*(\d+(?:\.\d+)?)\s*gb\b/i);
  if (modules) return Number(modules[1]) * Number(modules[2]);
  const match = text.match(/(\d+(?:\.\d+)?)\s*gb\b/i);
  return match ? Number(match[1]) : null;
}

export function storageGBOf(value) {
  const text = String(value ?? "").toLowerCase();
  const matches = [...text.matchAll(/(\d+(?:\.\d+)?)\s*(tb|gb)\b/g)];
  if (!matches.length) return null;
  const capacities = matches.map((match) => Number(match[1]) * (match[2] === "tb" ? 1024 : 1));
  return /\+|\band\b/.test(text) ? capacities.reduce((total, size) => total + size, 0) : Math.max(...capacities);
}

export function requirementsForGameIds(gameIds) {
  const profiles = gameIds.map((id) => GAME_REQUIREMENTS[id]);
  const highestGpuProfile = profiles.reduce((highest, profile) =>
    profile.gpuRank > highest.gpuRank ? profile : highest
  );
  return {
    cpuTier: Math.max(...profiles.map((profile) => profile.cpuTier)),
    cpuCores: Math.max(...profiles.map((profile) => profile.cpuCores)),
    gpuRank: Math.max(...profiles.map((profile) => profile.gpuRank)),
    gpuLabel: highestGpuProfile.gpuLabel,
    ramGB: Math.max(...profiles.map((profile) => profile.ramGB)),
    storageGB: Math.max(...profiles.map((profile) => profile.storageGB)),
  };
}

export function meetsRequirements(build, requirements) {
  const cpuTier = cpuTierOf(build.cpu);
  const cpuCores = cpuCoresOf(build.cpu);
  const gpuRank = gpuRankOf(build.gpu);
  const ramGB = ramGBOf(build.ram);
  const storageGB = storageGBOf(build.storage);

  return (requirements.cpuTier === 0 || (cpuTier !== null && cpuTier >= requirements.cpuTier))
    && (cpuCores !== null && cpuCores >= requirements.cpuCores)
    && (gpuRank !== null && gpuRank >= requirements.gpuRank)
    && (ramGB !== null && ramGB >= requirements.ramGB)
    && (storageGB !== null && storageGB >= requirements.storageGB);
}

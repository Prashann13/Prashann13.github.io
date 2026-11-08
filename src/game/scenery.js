function arch(ctx, x, y, width, height, colors) {
  ctx.fillStyle = colors.near; ctx.fillRect(x, y + 10, width, height - 10);
  ctx.fillRect(x + 4, y + 4, width - 8, 8); ctx.fillRect(x + 10, y, width - 20, 6);
  ctx.fillStyle = colors.sky; ctx.fillRect(x + 5, y + 16, width - 10, height - 16);
  ctx.fillStyle = colors.far; ctx.fillRect(x + width / 2 - 1, y + 8, 2, height - 8);
  ctx.fillRect(x + 5, y + 46, width - 10, 2);
}

export function drawBackground(ctx, state, config, colors) {
  ctx.fillStyle = colors.sky; ctx.fillRect(0, 0, config.width, config.height);
  ctx.fillStyle = colors.moon; ctx.fillRect(389, 20, 24, 24); ctx.fillRect(385, 26, 32, 12);
  ctx.fillStyle = colors.sky; ctx.fillRect(397, 20, 16, 9); ctx.fillRect(405, 29, 12, 7);
  ctx.fillStyle = colors.highlight;
  for (let i = 0; i < 22; i++) ctx.fillRect((i * 73 + 19) % 480, (i * 17 + 9) % 80, 1, 1);
  const offset = state.reduced ? 0 : Math.round(state.camera * .15) % 144;
  for (let i = -1; i < 5; i++) {
    const x = i * 144 - offset;
    ctx.fillStyle = colors.far; ctx.fillRect(x, 78, 100, 152); ctx.fillRect(x + 10, 46, 22, 32);
    ctx.fillRect(x + 66, 32, 26, 46); ctx.fillRect(x + 6, 41, 30, 6); ctx.fillRect(x + 62, 27, 34, 6);
    for (let j = 0; j < 4; j++) { ctx.fillRect(x + 6 + j * 9, 35, 5, 6); ctx.fillRect(x + 63 + j * 9, 21, 5, 6); }
    ctx.fillStyle = colors.sky;
    for (let j = 0; j < 4; j++) ctx.fillRect(x + 18 + j * 20, 100, 5, 18);
    ctx.fillStyle = colors.near; ctx.fillRect(x - 16, 203, 135, 27);
  }
}

export function drawCastle(ctx, state, config, colors) {
  const left = Math.floor(state.camera / 144) * 144 - 144, right = state.camera + config.width + 144;
  for (let x = left; x < right; x += 144) {
    const hall = x >= 1900, throne = x >= 3900;
    if (hall) {
      ctx.fillStyle = colors.far; ctx.fillRect(x, 8, 18, 222); ctx.fillRect(x - 4, 14, 26, 8);
      ctx.fillStyle = colors.near; ctx.fillRect(x, 28, 3, 190); ctx.fillRect(x - 4, 218, 26, 12);
      arch(ctx, x + 47, 54, 48, 133, colors);
      ctx.globalAlpha = .3; ctx.fillStyle = throne ? colors.hazard : colors.pickup;
      ctx.fillRect(x + 55, 72, 32, 42); ctx.fillRect(x + 55, 120, 32, 58); ctx.globalAlpha = 1;
      if (throne) { ctx.fillStyle = colors.hazard; ctx.fillRect(x + 24, 35, 13, 75); ctx.fillRect(x + 28, 110, 5, 7); }
    } else {
      ctx.fillStyle = colors.near; ctx.fillRect(x, 180, 144, 3);
      for (let fence = x; fence < x + 144; fence += 12) {
        ctx.fillRect(fence, 172, 2, 57); ctx.fillRect(fence - 1, 169, 4, 4);
      }
      ctx.fillStyle = colors.far; ctx.fillRect(x + 40, 201, 22, 29); ctx.fillRect(x + 45, 193, 12, 8);
    }
    const fire = state.reduced ? 0 : Math.floor(state.elapsed * 8 + x) % 3;
    ctx.fillStyle = colors.ink; ctx.fillRect(x + 120, 165, 5, 17); ctx.fillRect(x + 115, 177, 12, 3);
    ctx.globalAlpha = .12; ctx.fillStyle = colors.pickup; ctx.fillRect(x + 107, 148, 30, 36); ctx.globalAlpha = 1;
    ctx.fillStyle = colors.pickup; ctx.fillRect(x + 119, 159 - fire, 5, 12 + fire);
    ctx.fillStyle = colors.highlight; ctx.fillRect(x + 120, 164 - fire, 2, 6);
  }
  for (const t of config.level.terrain) {
    if (t.x > right || t.x + t.width < left) continue;
    ctx.fillStyle = colors.ground; ctx.fillRect(t.x, t.y, t.width, t.height);
    ctx.fillStyle = colors.near;
    const start = Math.max(t.x, Math.floor(left / 28) * 28);
    for (let y = t.y + 8; y < t.y + t.height; y += 14) {
      ctx.fillRect(t.x, y, t.width, 1);
      for (let x = start; x < Math.min(t.x + t.width, right); x += 28) ctx.fillRect(x + (y % 2) * 8, y, 1, 14);
    }
    ctx.fillStyle = colors.steel; ctx.fillRect(t.x, t.y, t.width, 2);
    ctx.fillStyle = colors.shadow; ctx.fillRect(t.x, t.y + 3, t.width, 3);
    if (t.height < 20) { ctx.fillStyle = colors.accent; ctx.fillRect(t.x + 3, t.y, t.width - 6, 1); }
  }
  for (const flag of config.level.checkpoints) {
    if (flag.x < left || flag.x > right) continue;
    const lit = flag.x <= (state.checkpoint?.x ?? -1);
    ctx.fillStyle = colors.steel; ctx.fillRect(flag.x, 183, 3, 47); ctx.fillRect(flag.x - 4, 226, 12, 4);
    ctx.fillStyle = lit ? colors.pickup : colors.cloak; ctx.fillRect(flag.x + 3, 184, 19, 12); ctx.fillRect(flag.x + 3, 196, 12, 4);
    ctx.fillStyle = colors.highlight; ctx.fillRect(flag.x + 7, 187, 3, 6);
  }
  arch(ctx, config.level.width - 88, 153, 48, 77, colors);
}

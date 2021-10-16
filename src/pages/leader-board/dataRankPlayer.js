const dataRankPlayer = [];
for (let i = 0; i < 100; i++) {
  dataRankPlayer.push({
    id: i + 1,
    name: `player ${i + 1}`,
    imageRegion: `https://zoogame.app/country-leadboard/${i + 1}.png`,
    imageItem: `https://zoogame.app/nfts/orange/1.png`,
    hashPower: 10000 - i * 100
  });
}
export { dataRankPlayer };

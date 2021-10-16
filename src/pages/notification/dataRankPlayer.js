const dataRankPlayer = [];
for (let i = 0; i < 50; i++) {
  dataRankPlayer.push({
    id: i + 1,
    name: `player ${i + 1}`,
    imageItem: `https://zoogame.app/nfts/orange/1.png`,
    score: 10000 - i * 100
  });
}
export { dataRankPlayer };

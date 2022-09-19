export const symbolDefine = {
  TLM: {
      code: 'alien.worlds',
      symbol: 'TLM',
      unit: 4,
  },
  Wax: {
      code: 'eosio.token',
      symbol: 'WAX',
      unit: 8,
  }
};
export const contractName = 'awmarketmain';
export const columnsOrder = [
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    align: 'center',
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    align: 'right',
  },
];
export const columnsSymbol = [
  // {
  //   title: 'Type',
  //   dataIndex: 'type',
  //   align: 'left',
  //   display: false,
  // },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    align: 'left',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    align: 'center',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    align: 'right',
  },
];
export const columnsTradeHistory = [
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Pair',
    dataIndex: 'pair',
    key: 'pair',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
  },
];
export const columnsOpenOrder = [...columnsTradeHistory,
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
];
export const myChain = {
  chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
  rpcEndpoints: [{
    protocol: 'https',
    host: 'wax.greymass.com',
    port: '443',
  }]
}
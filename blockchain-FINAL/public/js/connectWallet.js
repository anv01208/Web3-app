// // connectWallet.js
// document.addEventListener('DOMContentLoaded', () => {
//     const connectButton = document.getElementById('wallet-connect');
//     if (connectButton) {
//       connectButton.addEventListener('click', event => {
//         if (window.ethereum) {
//           window.ethereum.request({method: 'eth_requestAccounts'}).then(accounts => {
//             const account = accounts[0];
//             console.log(account);
//             alert('Wallet connected: ' + account);
//           }).catch((error) => {
//             console.error(error);
//             alert('An error occurred. Please try again.');
//           });
//         } else {
//           alert('Please install MetaMask to use this feature.');
//         }
//       });
//     }
//   });
document.getElementById('wallet-connect').addEventListener('click', event => {
    let account;
    let button = event.target;
    ethereum.request({method: 'eth_requestAccounts'}).then(accounts => {
      account = accounts[0];
      console.log(account);
      button.textContent = account;
    });
    ethereum.request({method: 'eth_requestAccounts'}).then(accounts => {
      account = accounts[0];
      console.log(account);

      ethereum.request({method: 'eth_getBalance' , params: [account, 'latest']}).then(result => {
        console.log(result);
        let wei = parseInt(result,16); 
        let balance = wei / (10**18);
        console.log(balance + " ETH");
      
      });
  
    });
    
  });

 
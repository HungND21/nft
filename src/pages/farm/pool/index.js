import {
  Badge,
  Box,
  Button,
  Grid,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  Spinner
} from '@chakra-ui/react';
import Web3 from 'web3';
import { ethers } from 'ethers';
import React from 'react';
import toast from 'react-hot-toast';

import { CgArrowUp, CgLockUnlock } from 'react-icons/cg';
import { useDispatch } from 'react-redux';
import { openModalWalletConnect } from 'store/metamaskSlice';
import ItemPool from './ItemPool';
// -------------
// import FBNBUSD from './FBNB-Usdt';

async function requestAccount() {
  if (window.ethereum?.request) return window.ethereum.request({ method: 'eth_requestAccounts' });
  throw new Error(
    'Missing install Metamask. Please access https://metamask.io/ to install extension on your browser'
  );
}
function PoolContract({ theme, colorMode, account, signer, FwarPool, pool, fwarPoolAddress }) {
  // balance số dư cặp trong ví của ng dùng
  // mystake số cặp ng dùng gửi vào
  const [isLoading, setIsLoading] = React.useState(false);
  const { isOpen: isOpenDeposit, onOpen: onOpenDeposit, onClose: onCloseDeposit } = useDisclosure();
  const { isOpen: isOpenDraw, onOpen: onOpenDraw, onClose: onCloseDraw } = useDisclosure();
  const [totalSupply, setTotalSupply] = React.useState(0);
  const [myStake, setMyStake] = React.useState(0);
  const [balance, setBalance] = React.useState(0);
  const [key, setKey] = React.useState(0);
  // const { isOpenDraw, onOpenDraw, onCloseDraw } = useDisclosure();
  const Contract = new ethers.Contract(pool.address, pool.abi, signer);
  

  const dispatch = useDispatch();
  const [isAllowance, setIsAllowance] = React.useState(false);
  const [amountWithdraw, setAmountWithdraw] = React.useState('');
  const [amountDeposit, setAmountDeposit] = React.useState('');

  const handleDeposit = async (contract, id, amount) => {
    // id pool, amount
    // id pool trong poolinfo

    try {
      if (amount) {
        setIsLoading(true);
        const result = await contract.poolStake(id, ethers.BigNumber.from(1e6).pow(3).mul(amount));
        setIsLoading(false);
        onCloseDeposit();
        console.log(result);
      }
      // await requestAccount();
    } catch (error) {
      if (error.code === -32603) {
        console.log(error.code);
      }
      toast.error(error.message);
      setIsLoading(false);

      onCloseDeposit();
    }
  };
  const handleApprove = async (contract, spender) => {
    try {
      await requestAccount();
      const result = await contract.approve(
        spender,
        ethers.BigNumber.from(1e6).pow(3).mul(1000000)
      );
      console.log(result);
      // allowance && allowance > 0 ? setIsAllowance(true) : setIsAllowance(false);
    } catch (error) {
      console.log(error.message);
      // console.error('message', error.message);
    }
  };
  const handleWithdraw = async (contract, id, amount) => {
    // id pool, amount
    // id pool trong poolinfo
    try {
      const poolWithdraw = await contract.poolWithdraw(
        id,
        ethers.BigNumber.from(1e6).pow(3).mul(amount)
      );
    } catch (error) {
      if (error.data) {
        // console.log(error);
        toast.error(error.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };
  const handleGetKey = async (contract, amount) => {
    console.log(FwarPool);
    try {
      // setIsLoading(true);
      const result = await FwarPool.getKey(pool.id);
      // setIsLoading(false);
      // onCloseDeposit();
      console.log(result);
      // await requestAccount();
    } catch (error) {
      if (error.code === -32603) {
        console.log(error.code);
      }
      toast.error(error.message);
      setIsLoading(false);

      onCloseDeposit();
    }
  };
  React.useEffect(() => {
    const init = async () => {
      // const Contract = new ethers.Contract(FBNBUSD.address, FBNBUSD.abi, signer);
      if (account) {
        const allowance = await Contract.allowance(
          account,
          fwarPoolAddress // address fwar pool
        );

        allowance && allowance > 0 ? setIsAllowance(true) : setIsAllowance(false);

        const totalSupplyValue = await FwarPool.poolInfo('0');
        const numberTotalSupply = Web3.utils.fromWei(totalSupplyValue['lpSupply']._hex, 'ether');

        setTotalSupply(numberTotalSupply);

        const myStakeInfo = await FwarPool.userInfo(pool.id, account);
        const numberMyStake = Web3.utils.fromWei(myStakeInfo.amount._hex, 'ether');
        setMyStake(numberMyStake);

        const balanceOf = await Contract.balanceOf(account);
        const numberBalanceOf = Web3.utils.fromWei(balanceOf._hex, 'ether');
        setBalance(numberBalanceOf);
        const reward = await FwarPool.pendingKey(pool.id, account);
        const numberKey = Web3.utils.fromWei(reward._hex, 'ether');
        setKey(numberKey);
        // console.log(reward);
      }
    };
    init();
  }, [account, handleDeposit]);
  return (
    <React.Fragment>
      <Box
        bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
        p={6}
        boxShadow={theme.shadows.content}
        position="relative"
      >
        {/* <Box position="absolute" w="100%" h="100%">
          <Spinner />
        </Box> */}

        {/* card header */}
        <Box display="flex" justifyContent="space-between">
          <Stack direction="row" spacing={-4}>
            <Tooltip label="hove label" hasArrow placement="top">
              <Box
                boxSize="50px"
                borderRadius="50%"
                border="2px solid white"
                cursor="pointer"
                transition="transform .25s ease"
                _hover={{ transform: 'scale(1.1)' }}
              >
                <Image src="https://zoogame.app/tokens/zoo.png" />
              </Box>
            </Tooltip>
            <Tooltip label="hove label" hasArrow placement="top">
              <Box
                boxSize="50px"
                borderRadius="50%"
                border="2px solid white"
                cursor="pointer"
                transition="transform .25s ease"
                _hover={{ transform: 'scale(1.1)' }}
              >
                <Image src="https://zoogame.app/tokens/zoo.png" />
              </Box>
            </Tooltip>
          </Stack>
          <Box textAlign="right">
            <Stack direction="row" justify="end">
              <Text fontWeight="semibold">USDT-BNB LP</Text>
              <Image
                boxSize="20px"
                borderRadius="50%"
                src="https://zoogame.app/tokens/pancake.png"
              />
            </Stack>
            <Badge
              variant="solid"
              colorScheme="cyan"
              borderRadius="1rem"
              px={2}
              marginLeft="0.25rem"
            >
              15X
            </Badge>
            <Badge
              variant="solid"
              colorScheme="green"
              borderRadius="1rem"
              px={2}
              marginLeft="0.25rem"
            >
              APY: 64995 %
            </Badge>
            <Badge
              variant="solid"
              colorScheme="green"
              borderRadius="1rem"
              px={2}
              marginLeft="0.25rem"
            >
              APR: 653 %
            </Badge>
          </Box>
        </Box>

        {/* card body */}
        <ItemPool
          color="#28c76f"
          title="Total Staked"
          total={Intl.NumberFormat().format(totalSupply)}
        />
        <ItemPool
          color="#6610f2"
          title="Total USD Value"
          total={Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            totalSupply * 5
          )}
        />
        <ItemPool color="#ea5455" title="My Staked" total={Number(myStake).toFixed(6)} />
        <ItemPool color="#ff9f43" title="Balance" total={Number(balance).toFixed(6)} />
        <ItemPool
          color="#00cfe8"
          title="Key"
          reward={Number(key).toFixed(6)}
          handleGetKey={handleGetKey}
        />

        {/* action body */}
        {account ? (
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)'
            }}
            gap={{ base: 1, sm: 4 }}
            mt={4}
          >
            <Button
              leftIcon={<CgLockUnlock />}
              w="full"
              color="white"
              bgColor="blue.base"
              borderRadius="2rem"
              _hover={{ boxShadow: theme.shadows.button }}
              onClick={isAllowance ? onOpenDeposit : () => handleApprove(Contract, fwarPoolAddress)}
            >
              {isAllowance ? `Deposit` : `Approve`}
            </Button>
            <Button
              leftIcon={<CgArrowUp />}
              w="full"
              color="white"
              bgColor="primary.base"
              borderRadius="2rem"
              marginRight="14px"
              _hover={{ boxShadow: theme.shadows.button }}
              onClick={onOpenDraw}
            >
              Withdraw
            </Button>
            <Button
              w="full"
              // color="white"
              // bgColor="blue.base"
              borderRadius="2rem"
              _hover={{ boxShadow: theme.shadows.button }}
            >
              Swap
            </Button>
            <Button
              w="full"
              // color="white"
              // bgColor="primary.base"
              borderRadius="2rem"
              marginRight="14px"
              _hover={{ boxShadow: theme.shadows.button }}
            >
              Add Liquidity
            </Button>
          </Grid>
        ) : (
          <Button
            w="full"
            color="white"
            bgColor="primary.base"
            borderRadius="2rem"
            marginRight="14px"
            _hover={{ boxShadow: theme.shadows.button }}
            onClick={() => dispatch(openModalWalletConnect())}
          >
            Unlock
          </Button>
        )}
      </Box>

      {/* Modal Withdraw */}
      <Modal
        isOpen={isOpenDraw}
        onClose={() => {
          onCloseDraw();
          setAmountWithdraw(0);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Withdraw</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              {/* If you add the size prop to `InputGroup`, it'll pass it to all its children. */}
              <InputGroup size="sm">
                <InputLeftAddon children="Amount" />
                <Input
                  placeholder="0"
                  value={amountWithdraw}
                  type="number"
                  onChange={(e) => setAmountWithdraw(e.target.value)}
                />
                <Button>Max</Button>
              </InputGroup>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="solid"
              onClick={() => handleWithdraw(FwarPool, pool.id, amountWithdraw)}
            >
              Withdraw
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal Deposit */}

      <Modal
        isOpen={isOpenDeposit}
        onClose={() => {
          onCloseDeposit();
          setAmountWithdraw(0);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Deposit</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              {/* If you add the size prop to `InputGroup`, it'll pass it to all its children. */}
              <InputGroup size="sm">
                <InputLeftAddon children="Amount" />
                <Input
                  placeholder="0"
                  value={amountDeposit}
                  type="number"
                  onChange={(e) => setAmountDeposit(e.target.value)}
                />
                <Button>Max</Button>
              </InputGroup>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="outline"
              isLoading={isLoading}
              colorScheme="teal"
              loadingText="Depositing"
              onClick={() => handleDeposit(FwarPool, pool.id, amountDeposit)}
            >
              {isAllowance ? `Deposit` : `Approve`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}

export default PoolContract;

/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface RegistryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "strategyIdIndex"
      | "strategyDescription"
      | "quoteTokenIndex"
      | "baseTokenIndex"
      | "oracles"
      | "quoteTokenCoherence"
      | "baseTokenCoherence"
      | "setOracle"
      | "unsetOracle"
      | "setStrategyPair"
      | "addStrategyId"
      | "modifyStrategyDescription"
      | "removeStrategyId"
      | "getOracle"
      | "isStrategyPair"
      | "owner"
      | "hasOracle"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "strategyIdIndex",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "strategyDescription",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "quoteTokenIndex",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "baseTokenIndex",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "oracles",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "quoteTokenCoherence",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "baseTokenCoherence",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setOracle",
    values: [AddressLike, AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "unsetOracle",
    values: [AddressLike, AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setStrategyPair",
    values: [BigNumberish, AddressLike, AddressLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "addStrategyId",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "modifyStrategyDescription",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "removeStrategyId",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getOracle",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isStrategyPair",
    values: [BigNumberish, AddressLike, AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "hasOracle",
    values: [AddressLike, AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "strategyIdIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "strategyDescription",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "quoteTokenIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "baseTokenIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "oracles", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "quoteTokenCoherence",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "baseTokenCoherence",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setOracle", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "unsetOracle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStrategyPair",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addStrategyId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "modifyStrategyDescription",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeStrategyId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getOracle", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isStrategyPair",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasOracle", data: BytesLike): Result;
}

export interface Registry extends BaseContract {
  connect(runner?: ContractRunner | null): Registry;
  waitForDeployment(): Promise<this>;

  interface: RegistryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  strategyIdIndex: TypedContractMethod<
    [strategyId: BigNumberish],
    [bigint],
    "view"
  >;

  strategyDescription: TypedContractMethod<
    [strategyId: BigNumberish],
    [string],
    "view"
  >;

  quoteTokenIndex: TypedContractMethod<
    [quoteToken: AddressLike],
    [bigint],
    "view"
  >;

  baseTokenIndex: TypedContractMethod<
    [baseToken: AddressLike],
    [bigint],
    "view"
  >;

  oracles: TypedContractMethod<
    [quoteToken: AddressLike, baseToken: AddressLike],
    [string],
    "view"
  >;

  quoteTokenCoherence: TypedContractMethod<
    [quoteToken: AddressLike],
    [bigint],
    "view"
  >;

  baseTokenCoherence: TypedContractMethod<
    [baseToken: AddressLike],
    [bigint],
    "view"
  >;

  setOracle: TypedContractMethod<
    [quoteToken: AddressLike, baseToken: AddressLike, oracle: AddressLike],
    [void],
    "nonpayable"
  >;

  unsetOracle: TypedContractMethod<
    [quoteToken: AddressLike, baseToken: AddressLike, oracle: AddressLike],
    [void],
    "nonpayable"
  >;

  setStrategyPair: TypedContractMethod<
    [
      strategyId: BigNumberish,
      quoteToken: AddressLike,
      baseToken: AddressLike,
      strategyPair: boolean
    ],
    [void],
    "nonpayable"
  >;

  addStrategyId: TypedContractMethod<
    [strategyId: BigNumberish, _strategyDescription: string],
    [void],
    "nonpayable"
  >;

  modifyStrategyDescription: TypedContractMethod<
    [strategyId: BigNumberish, _strategyDescription: string],
    [void],
    "nonpayable"
  >;

  removeStrategyId: TypedContractMethod<
    [strategyId: BigNumberish],
    [void],
    "nonpayable"
  >;

  getOracle: TypedContractMethod<
    [quoteToken: AddressLike, baseToken: AddressLike],
    [string],
    "view"
  >;

  isStrategyPair: TypedContractMethod<
    [strategyId: BigNumberish, quoteToken: AddressLike, baseToken: AddressLike],
    [boolean],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  hasOracle: TypedContractMethod<
    [quoteToken: AddressLike, baseToken: AddressLike],
    [boolean],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "strategyIdIndex"
  ): TypedContractMethod<[strategyId: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "strategyDescription"
  ): TypedContractMethod<[strategyId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "quoteTokenIndex"
  ): TypedContractMethod<[quoteToken: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "baseTokenIndex"
  ): TypedContractMethod<[baseToken: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "oracles"
  ): TypedContractMethod<
    [quoteToken: AddressLike, baseToken: AddressLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "quoteTokenCoherence"
  ): TypedContractMethod<[quoteToken: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "baseTokenCoherence"
  ): TypedContractMethod<[baseToken: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "setOracle"
  ): TypedContractMethod<
    [quoteToken: AddressLike, baseToken: AddressLike, oracle: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "unsetOracle"
  ): TypedContractMethod<
    [quoteToken: AddressLike, baseToken: AddressLike, oracle: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setStrategyPair"
  ): TypedContractMethod<
    [
      strategyId: BigNumberish,
      quoteToken: AddressLike,
      baseToken: AddressLike,
      strategyPair: boolean
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "addStrategyId"
  ): TypedContractMethod<
    [strategyId: BigNumberish, _strategyDescription: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "modifyStrategyDescription"
  ): TypedContractMethod<
    [strategyId: BigNumberish, _strategyDescription: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "removeStrategyId"
  ): TypedContractMethod<[strategyId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getOracle"
  ): TypedContractMethod<
    [quoteToken: AddressLike, baseToken: AddressLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "isStrategyPair"
  ): TypedContractMethod<
    [strategyId: BigNumberish, quoteToken: AddressLike, baseToken: AddressLike],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "hasOracle"
  ): TypedContractMethod<
    [quoteToken: AddressLike, baseToken: AddressLike],
    [boolean],
    "view"
  >;

  filters: {};
}

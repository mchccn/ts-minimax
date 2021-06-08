type And<A extends boolean, B extends boolean> = A extends true ? B extends true ? true : false : false;

type Increment<X extends number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10][X];
type Decrement<X extends number> = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8][X];

type UnknownArray = ReadonlyArray<unknown>;

type Counter = readonly [
  -30, -29, -28, -27, -26, -25, -24, -23, -22, -21,
  -20, -19, -18, -17, -16, -15, -14, -13, -12, -11,
  -10,  -9,  -8,  -7,  -6,  -5,  -4,  -3,  -2,  -1,
    0,   1,   2,   3,   4,   5,   6,   7,   8,   9,
   10,  11,  12,  13,  14,  15,  16,  17,  18,  19,
   20,  21,  22,  23,  24,  25,  26,  27,  28,  29,
];

type TupleFirst<
  Tuple extends UnknownArray,
> = (
  Tuple extends Readonly<[infer Head, ...UnknownArray]>
  ? Head
  : never
);

type TupleExcludingFirst<
  Tuple extends UnknownArray,
> = (
  Tuple extends Readonly<[unknown, ...infer Tail]>
  ? Tail
  : never
);

type Min<A extends number, B extends number> = GreaterThan<B, A> extends true ? A : B;
type Max<A extends number, B extends number> = GreaterThan<A, B> extends true ? A : B;

type GreaterThan<
  A extends number,
  B extends number,
  Checked extends ReadonlyArray<number> = Counter,
> = (
  TupleFirst<Checked> extends A ? false : 
  TupleFirst<Checked> extends B ? true :
  //@ts-ignore
  GreaterThan<A, B, TupleExcludingFirst<Readonly<Checked>>>
);

type Empty = " ";
type Player = "x";
type Computer = "o";

type Token = Empty | Player | Computer;

type Board = [
    [Token, Token, Token],
    [Token, Token, Token],
    [Token, Token, Token],
];

type Row = [Token, Token, Token];

type Index= 0 | 1 | 2;

type AreMovesLeftHelper<R> = 
    R extends [infer First, ...infer Rest]
        ? First extends Empty
            ? true
            : AreMovesLeftHelper<Rest>
        : false;

type AreMovesLeft<B> = 
    B extends [infer First, ...infer Rest] 
        ? AreMovesLeftHelper<First> extends true
            ? true
            : AreMovesLeft<Rest>
        : false;

type RotateBoard<B extends Board> = [
    [B[2][0], B[1][0], B[0][0]],
    [B[2][1], B[1][1], B[0][1]],
    [B[2][2], B[1][2], B[0][2]],
];

type Replace<B extends Board, X extends Index, Y extends Index, T extends Token> = [
    [
        X extends 0 ? Y extends 0 ? T : B[0][0] : B[0][0],
        X extends 1 ? Y extends 0 ? T : B[1][0] : B[1][0],
        X extends 2 ? Y extends 0 ? T : B[2][0] : B[2][0],
    ],
    [
        X extends 0 ? Y extends 1 ? T : B[0][1] : B[0][1],
        X extends 1 ? Y extends 1 ? T : B[1][1] : B[1][1],
        X extends 2 ? Y extends 1 ? T : B[2][1] : B[2][1],
    ],
        [
        X extends 0 ? Y extends 2 ? T : B[0][2] : B[0][2],
        X extends 1 ? Y extends 2 ? T : B[1][2] : B[1][2],
        X extends 2 ? Y extends 2 ? T : B[2][2] : B[2][2],
    ],
];

type EvaluateRow<R extends Row> =
    And<R[0] extends R[1] ? true : false, R[1] extends R[2] ? true : false> extends true
        ? R[0] extends Player
            ? 1
            : R[0] extends Computer
                ? -1
                : void
        : void;

type EvaluateAllRows<B extends Board> = 
    EvaluateRow<B[0] & Row> extends number
        ? EvaluateRow<B[0] & Row>
        : EvaluateRow<B[1] & Row> extends number
            ? EvaluateRow<B[1] & Row>
            : EvaluateRow<B[2] & Row> extends number
                ? EvaluateRow<B[2] & Row>
                : void;

type EvaluateDiagonal<B extends Board> = 
    And<B[0][0] extends B[1][1] ? true : false, B[1][1] extends B[2][2] ? true : false> extends true
        ? B[0][0] extends Player
            ? 1
            : B[0][0] extends Computer
                ? -1
                : void
        : void;

type Evaluate<B extends Board> = 
    EvaluateAllRows<B> extends number
        ? EvaluateAllRows<B>
        : EvaluateAllRows<RotateBoard<B>> extends number
            ? EvaluateAllRows<RotateBoard<B>>
            : EvaluateDiagonal<B> extends number
                ? EvaluateDiagonal<B>
                : EvaluateDiagonal<RotateBoard<B>> extends number
                    ? EvaluateDiagonal<RotateBoard<B>>
                    : 0;

type MinimaxMaxCell<B extends Board, D extends number, IsMax extends boolean, X extends Index, Y extends Index, Best extends number> = 
    B[X][Y] extends Empty
        ? Max<Best, Minimax<Replace<B, X, Y, Player>, D, IsMax extends true ? false : true>>
        : Best;

type MinimaxMinCell<B extends Board, D extends number, IsMax extends boolean, X extends Index, Y extends Index, Best extends number> = 
    B[X][Y] extends Empty
        ? Min<Best, Minimax<Replace<B, X, Y, Computer>, D, IsMax extends true ? false : true>>
        : Best;

type MinimaxHelper<B extends Board, D extends number, IsMax extends boolean> = 
    AreMovesLeft<B> extends false
        ? 0
        : IsMax extends true
            ? MinimaxMaxCell<B, D, IsMax, 2, 2, 
                MinimaxMaxCell<B, D, IsMax, 2, 1, 
                    MinimaxMaxCell<B, D, IsMax, 2, 0, 
                        MinimaxMaxCell<B, D, IsMax, 1, 2, 
                            MinimaxMaxCell<B, D, IsMax, 1, 1, 
                                MinimaxMaxCell<B, D, IsMax, 1, 0, 
                                    MinimaxMaxCell<B, D, IsMax, 0, 2, 
                                        MinimaxMaxCell<B, D, IsMax, 0, 1, 
                                            MinimaxMaxCell<B, D, IsMax, 0, 0, -10>
                                            >
                                        >
                                    >
                                >
                            >
                        >
                    >
                >
            : MinimaxMinCell<B, D, IsMax, 2, 2, 
                MinimaxMinCell<B, D, IsMax, 2, 1, 
                    MinimaxMinCell<B, D, IsMax, 2, 0, 
                        MinimaxMinCell<B, D, IsMax, 1, 2, 
                            MinimaxMinCell<B, D, IsMax, 1, 1, 
                                MinimaxMinCell<B, D, IsMax, 1, 0, 
                                    MinimaxMinCell<B, D, IsMax, 0, 2, 
                                        MinimaxMinCell<B, D, IsMax, 0, 1, 
                                            MinimaxMinCell<B, D, IsMax, 0, 0, 10>
                                            >
                                        >
                                    >
                                >
                            >
                        >
                    >
                >;

type Minimax<B extends Board, D extends number, IsMax extends boolean> = 
    Evaluate<B> extends infer Score
        ? Score extends 1 | -1
            ? Score
            : MinimaxHelper<B, D, IsMax>
        : MinimaxHelper<B, D, IsMax>;

type BestMoveHelper<B extends Board, X extends Index, Y extends Index, Best extends number, BestX extends Index = 0, BestY extends Index = 0> =
    Minimax<B, 0, false> extends infer Score
        ? GreaterThan<Score & number, Best> extends true
            ? And<X extends 2 ? true : false, Y extends 2 ? true : false> extends true 
                ? [BestX, BestY] 
                : BestMoveHelper<B, (Y extends 2 ? Increment<X> : X) & Index, Y extends 2 ? 0 : Increment<Y>, Score & number, X, Y>
            : And<X extends 2 ? true : false, Y extends 2 ? true : false> extends true 
                ? [BestX, BestY] 
                : BestMoveHelper<B, (Y extends 2 ? Increment<X> : X) & Index, Y extends 2 ? 0 : Increment<Y>, Best, BestX, BestY>
        : never;

type BestMove<B extends Board> = BestMoveHelper<B, 0, 0, -10>;

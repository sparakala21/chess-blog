import type { MDXComponents } from "mdx/types";
import { CTACard } from "./_components/CTAcard";
import { ChessBoard } from "./_components/ChessBoard";
//import { PGNChessBoard } from "./_components/PGNChessBoard";
export function useMDXComponents(components: MDXComponents): MDXComponents 
{  
    return {    ...components,
                CTACard,
                ChessBoard,
                //PGNChessBoard
      };
}
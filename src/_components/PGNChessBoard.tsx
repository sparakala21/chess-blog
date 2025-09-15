// "use client";
// import { Box, Button, Card, Typography, Alert, IconButton } from '@mui/joy';
// import { useState, useEffect, useMemo } from 'react';
// import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';

// interface ChessMove {
//   san: string;
//   from: string;
//   to: string;
//   piece: string;
//   captured?: string;
//   promotion?: string;
//   castle?: 'kingside' | 'queenside';
//   enPassant?: boolean;
// }

// export const PGNChessBoard = ({ 
//   pgn = "",
//   size = 400,
//   showCoordinates = true,
//   caption,
//   autoplay = false,
//   autoplayDelay = 1000
// }: {
//   pgn?: string;
//   size?: number;
//   showCoordinates?: boolean;
//   caption?: string;
//   autoplay?: boolean;
//   autoplayDelay?: number;
// }) => {
//   const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
//   const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(false);

//   // Initial board position
//   const initialBoard = {
//     'a8': 'r', 'b8': 'n', 'c8': 'b', 'd8': 'q', 'e8': 'k', 'f8': 'b', 'g8': 'n', 'h8': 'r',
//     'a7': 'p', 'b7': 'p', 'c7': 'p', 'd7': 'p', 'e7': 'p', 'f7': 'p', 'g7': 'p', 'h7': 'p',
//     'a2': 'P', 'b2': 'P', 'c2': 'P', 'd2': 'P', 'e2': 'P', 'f2': 'P', 'g2': 'P', 'h2': 'P',
//     'a1': 'R', 'b1': 'N', 'c1': 'B', 'd1': 'Q', 'e1': 'K', 'f1': 'B', 'g1': 'N', 'h1': 'R'
//   };

//   // Parse PGN and extract moves
//   const moves = useMemo(() => {
//     if (!pgn.trim()) return [];
    
//     // Remove comments, variations, and metadata
//     let cleanPgn = pgn
//       .replace(/\{[^}]*\}/g, '') // Remove comments in braces
//       .replace(/\([^)]*\)/g, '') // Remove variations in parentheses
//       .replace(/\[[^\]]*\]/g, '') // Remove metadata tags
//       .replace(/\d+\./g, '') // Remove move numbers
//       .replace(/\s+/g, ' ') // Normalize whitespace
//       .trim();

//     // Split into individual moves and filter out result indicators
//     return cleanPgn
//       .split(' ')
//       .filter(move => move && !['1-0', '0-1', '1/2-1/2', '*'].includes(move));
//   }, [pgn]);

//   // Simple move parser (basic implementation)
//   const parseMove = (san: string, board: { [key: string]: string }, isWhiteToMove: boolean): ChessMove | null => {
//     // This is a simplified parser - in a real implementation you'd want a full chess engine
//     // For now, we'll handle basic moves without full validation
    
//     // Castling
//     if (san === 'O-O' || san === '0-0') {
//       const rank = isWhiteToMove ? '1' : '8';
//       return {
//         san,
//         from: `e${rank}`,
//         to: `g${rank}`,
//         piece: isWhiteToMove ? 'K' : 'k',
//         castle: 'kingside'
//       };
//     }
//     if (san === 'O-O-O' || san === '0-0-0') {
//       const rank = isWhiteToMove ? '1' : '8';
//       return {
//         san,
//         from: `e${rank}`,
//         to: `c${rank}`,
//         piece: isWhiteToMove ? 'K' : 'k',
//         castle: 'queenside'
//       };
//     }

//     // Remove check/mate indicators
//     const cleanMove = san.replace(/[+#]$/, '');
    
//     // Extract destination square (last 2 characters)
//     const to = cleanMove.slice(-2);
//     if (!/^[a-h][1-8]$/.test(to)) return null;

//     // Determine piece type
//     let piece = 'P'; // Default to pawn
//     let moveStr = cleanMove;
    
//     if (/^[KQRBN]/.test(cleanMove)) {
//       piece = cleanMove[0];
//       moveStr = cleanMove.slice(1);
//     }

//     // Adjust for color
//     piece = isWhiteToMove ? piece : piece.toLowerCase();

//     // For now, we'll do a simple search for the piece that can make this move
//     // This is incomplete but will work for many basic positions
//     let from = '';
    
//     // Find pieces of the right type that could move to the destination
//     for (const [square, boardPiece] of Object.entries(board)) {
//       if (boardPiece.toLowerCase() === piece.toLowerCase() && 
//           ((isWhiteToMove && boardPiece === boardPiece.toUpperCase()) || 
//            (!isWhiteToMove && boardPiece === boardPiece.toLowerCase()))) {
//         // Simple check - this would need proper move validation in a real implementation
//         from = square;
//         break;
//       }
//     }

//     return {
//       san,
//       from,
//       to,
//       piece,
//       captured: board[to] ? board[to] : undefined
//     };
//   };

//   // Apply a move to the board
//   const applyMove = (board: { [key: string]: string }, move: ChessMove): { [key: string]: string } => {
//     const newBoard = { ...board };

//     if (move.castle) {
//       // Handle castling
//       if (move.castle === 'kingside') {
//         const rank = move.piece === 'K' ? '1' : '8';
//         const rook = move.piece === 'K' ? 'R' : 'r';
        
//         delete newBoard[`e${rank}`];
//         delete newBoard[`h${rank}`];
//         newBoard[`g${rank}`] = move.piece;
//         newBoard[`f${rank}`] = rook;
//       } else if (move.castle === 'queenside') {
//         const rank = move.piece === 'K' ? '1' : '8';
//         const rook = move.piece === 'K' ? 'R' : 'r';
        
//         delete newBoard[`e${rank}`];
//         delete newBoard[`a${rank}`];
//         newBoard[`c${rank}`] = move.piece;
//         newBoard[`d${rank}`] = rook;
//       }
//     } else {
//       // Regular move
//       if (move.from) delete newBoard[move.from];
//       newBoard[move.to] = move.piece;
//     }

//     return newBoard;
//   };

//   // Calculate board position at current move
//   const currentBoard = useMemo(() => {
//     let board = { ...initialBoard };
//     let isWhiteToMove = true;

//     for (let i = 0; i < currentMoveIndex; i++) {
//       const move = parseMove(moves[i], board, isWhiteToMove);
//       if (move) {
//         board = applyMove(board, move);
//       }
//       isWhiteToMove = !isWhiteToMove;
//     }

//     return board;
//   }, [moves, currentMoveIndex]);

//   // Get piece symbol (using Unicode chess pieces)
//   const getPieceSymbol = (piece: string) => {
//     const pieces: { [key: string]: string } = {
//       'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
//       'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
//     };
//     return pieces[piece] || '';
//   };

//   // Check if piece is white (uppercase) or black (lowercase)
//   const isWhitePiece = (piece: string) => piece === piece.toUpperCase();

//   // Navigation functions
//   const goToStart = () => setCurrentMoveIndex(0);
//   const goToEnd = () => setCurrentMoveIndex(moves.length);
//   const goToPrevious = () => setCurrentMoveIndex(Math.max(0, currentMoveIndex - 1));
//   const goToNext = () => setCurrentMoveIndex(Math.min(moves.length, currentMoveIndex + 1));

//   // Autoplay functionality
//   useEffect(() => {
//     if (isAutoPlaying && currentMoveIndex < moves.length) {
//       const timer = setTimeout(() => {
//         setCurrentMoveIndex(prev => prev + 1);
//       }, autoplayDelay);
      
//       return () => clearTimeout(timer);
//     } else if (currentMoveIndex >= moves.length) {
//       setIsAutoPlaying(false);
//     }
//   }, [isAutoPlaying, currentMoveIndex, moves.length, autoplayDelay]);

//   const toggleAutoplay = () => {
//     if (currentMoveIndex >= moves.length) {
//       setCurrentMoveIndex(0);
//     }
//     setIsAutoPlaying(!isAutoPlaying);
//   };

//   const squareSize = size / 8;
//   const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
//   const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

//   return (
//     <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <Card sx={{ p: 2, display: 'inline-block' }}>
//         <Box
//           sx={{
//             position: 'relative',
//             width: size,
//             height: size,
//             border: '2px solid',
//             borderColor: 'neutral.600',
//             borderRadius: 'sm',
//           }}
//         >
//           {/* Board squares */}
//           {ranks.map((rank, rankIndex) => 
//             files.map((file, fileIndex) => {
//               const square = file + rank;
//               const isLight = (rankIndex + fileIndex) % 2 === 0;
//               const piece = currentBoard[square];
              
//               return (
//                 <Box
//                   key={square}
//                   sx={{
//                     position: 'absolute',
//                     left: fileIndex * squareSize,
//                     top: rankIndex * squareSize,
//                     width: squareSize,
//                     height: squareSize,
//                     backgroundColor: isLight ? '#f0d9b5' : '#b58863',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     fontSize: squareSize * 0.6,
//                     cursor: 'pointer',
//                     transition: 'opacity 0.2s',
//                     opacity: hoveredSquare === square ? 0.8 : 1,
//                     '&:hover': {
//                       opacity: 0.8,
//                     }
//                   }}
//                   onMouseEnter={() => setHoveredSquare(square)}
//                   onMouseLeave={() => setHoveredSquare(null)}
//                   title={square}
//                 >
//                   {piece && (
//                     <span style={{ 
//                       color: isWhitePiece(piece) ? '#ffffff' : '#000000',
//                       textShadow: isWhitePiece(piece) 
//                         ? '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 1px rgba(0,0,0,0.8)' 
//                         : '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 1px rgba(255,255,255,0.8)',
//                       userSelect: 'none',
//                       fontWeight: 'bold'
//                     }}>
//                       {getPieceSymbol(piece)}
//                     </span>
//                   )}
//                 </Box>
//               );
//             })
//           )}
          
//           {/* Coordinates */}
//           {showCoordinates && (
//             <>
//               {/* File labels (a-h) */}
//               {files.map((file, index) => (
//                 <Typography
//                   key={`file-${file}`}
//                   level="body-xs"
//                   sx={{
//                     position: 'absolute',
//                     bottom: 4,
//                     left: index * squareSize + squareSize / 2,
//                     transform: 'translateX(-50%)',
//                     color: index % 2 === 0 ? '#b58863' : '#f0d9b5',
//                     fontWeight: 'bold',
//                     fontSize: '10px',
//                     userSelect: 'none',
//                   }}
//                 >
//                   {file}
//                 </Typography>
//               ))}
              
//               {/* Rank labels (1-8) */}
//               {ranks.map((rank, index) => (
//                 <Typography
//                   key={`rank-${rank}`}
//                   level="body-xs"
//                   sx={{
//                     position: 'absolute',
//                     left: 4,
//                     top: index * squareSize + 4,
//                     color: index % 2 === 0 ? '#f0d9b5' : '#b58863',
//                     fontWeight: 'bold',
//                     fontSize: '10px',
//                     userSelect: 'none',
//                   }}
//                 >
//                   {rank}
//                 </Typography>
//               ))}
//             </>
//           )}
//         </Box>
//       </Card>

//       {/* Navigation Controls */}
//       <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//         <IconButton 
//           size="sm" 
//           variant="outlined" 
//           onClick={goToStart}
//           disabled={currentMoveIndex === 0}
//         >
//           <SkipBack size={16} />
//         </IconButton>
        
//         <IconButton 
//           size="sm" 
//           variant="outlined" 
//           onClick={goToPrevious}
//           disabled={currentMoveIndex === 0}
//         >
//           <ChevronLeft size={16} />
//         </IconButton>

//         <Typography level="body-sm" sx={{ mx: 2, minWidth: 60, textAlign: 'center' }}>
//           {currentMoveIndex} / {moves.length}
//         </Typography>

//         <IconButton 
//           size="sm" 
//           variant="outlined" 
//           onClick={goToNext}
//           disabled={currentMoveIndex >= moves.length}
//         >
//           <ChevronRight size={16} />
//         </IconButton>
        
//         <IconButton 
//           size="sm" 
//           variant="outlined" 
//           onClick={goToEnd}
//           disabled={currentMoveIndex >= moves.length}
//         >
//           <SkipForward size={16} />
//         </IconButton>

//         {moves.length > 0 && (
//           <Button 
//             size="sm" 
//             variant={isAutoPlaying ? "solid" : "outlined"}
//             onClick={toggleAutoplay}
//             sx={{ ml: 2 }}
//           >
//             {isAutoPlaying ? 'Pause' : 'Autoplay'}
//           </Button>
//         )}
//       </Box>

//       {/* Current Move Display */}
//       {moves.length > 0 && currentMoveIndex > 0 && (
//         <Typography level="body-sm" sx={{ mt: 1, color: 'text.secondary' }}>
//           Last move: {moves[currentMoveIndex - 1]}
//         </Typography>
//       )}

//       {/* Move List */}
//       {moves.length > 0 && (
//         <Box sx={{ mt: 2, maxWidth: size, overflow: 'auto', maxHeight: 120 }}>
//           <Typography level="body-xs" sx={{ mb: 1, fontWeight: 'bold' }}>
//             Moves:
//           </Typography>
//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//             {moves.map((move, index) => (
//               <Button
//                 key={index}
//                 size="sm"
//                 variant={index < currentMoveIndex ? "solid" : "outlined"}
//                 color={index < currentMoveIndex ? "primary" : "neutral"}
//                 onClick={() => setCurrentMoveIndex(index + 1)}
//                 sx={{ 
//                   minWidth: 'auto', 
//                   px: 1,
//                   fontSize: '11px',
//                   opacity: index < currentMoveIndex ? 1 : 0.7
//                 }}
//               >
//                 {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'} {move}
//               </Button>
//             ))}
//           </Box>
//         </Box>
//       )}
      
//       {caption && (
//         <Typography level="body-sm" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
//           {caption}
//         </Typography>
//       )}
      
//       {hoveredSquare && (
//         <Typography level="body-xs" sx={{ mt: 1, color: 'text.tertiary' }}>
//           Square: {hoveredSquare} {currentBoard[hoveredSquare] && `(${isWhitePiece(currentBoard[hoveredSquare]) ? 'White' : 'Black'} ${getPieceSymbol(currentBoard[hoveredSquare])})`}
//         </Typography>
//       )}

//       {moves.length === 0 && pgn && (
//         <Alert color="warning" sx={{ mt: 2 }}>
//           No valid moves found in PGN. Please check the format.
//         </Alert>
//       )}
//     </Box>
//   );
// };
"use client";
import { Box, Button, Card, Typography, Alert } from '@mui/joy';
import Image from 'next/image';
import { useState } from 'react';

export const ChessBoard = ({ 
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  size = 400,
  showCoordinates = true,
  caption
}: {
  fen?: string;
  size?: number;
  showCoordinates?: boolean;
  caption?: string;
}) => {
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);

  // Parse FEN notation to get piece positions
  const parseFEN = (fen: string) => {
    const board: { [key: string]: string } = {};
    const rows = fen.split(' ')[0].split('/');
    
    rows.forEach((row, rankIndex) => {
      let fileIndex = 0;
      for (const char of row) {
        if (isNaN(parseInt(char))) {
          // It's a piece
          const file = String.fromCharCode(97 + fileIndex); // a-h
          const rank = (8 - rankIndex).toString(); // 8-1
          board[file + rank] = char;
          fileIndex++;
        } else {
          // It's a number of empty squares
          fileIndex += parseInt(char);
        }
      }
    });
    
    return board;
  };

  // Get piece symbol (using Unicode chess pieces)
  const getPieceSymbol = (piece: string) => {
    const pieces: { [key: string]: string } = {
      'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
      'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
    };
    return pieces[piece] || '';
  };

  // Check if piece is white (uppercase) or black (lowercase)
  const isWhitePiece = (piece: string) => piece === piece.toUpperCase();

  const board = parseFEN(fen);
  const squareSize = size / 8;
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card sx={{ p: 2, display: 'inline-block' }}>
        <Box
          sx={{
            position: 'relative',
            width: size,
            height: size,
            border: '2px solid',
            borderColor: 'neutral.600',
            borderRadius: 'sm',
          }}
        >
          {/* Board squares */}
          {ranks.map((rank, rankIndex) => 
            files.map((file, fileIndex) => {
              const square = file + rank;
              const isLight = (rankIndex + fileIndex) % 2 === 0;
              const piece = board[square];
              
              return (
                <Box
                  key={square}
                  sx={{
                    position: 'absolute',
                    left: fileIndex * squareSize,
                    top: rankIndex * squareSize,
                    width: squareSize,
                    height: squareSize,
                    backgroundColor: isLight ? '#f0d9b5' : '#b58863',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: squareSize * 0.6,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                    opacity: hoveredSquare === square ? 0.8 : 1,
                    '&:hover': {
                      opacity: 0.8,
                    }
                  }}
                  onMouseEnter={() => setHoveredSquare(square)}
                  onMouseLeave={() => setHoveredSquare(null)}
                  title={square}
                >
                  {piece && (
                    <span style={{ 
                      color: isWhitePiece(piece) ? '#ffffff' : '#000000',
                      textShadow: isWhitePiece(piece) 
                        ? '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 1px rgba(0,0,0,0.8)' 
                        : '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 1px rgba(255,255,255,0.8)',
                      userSelect: 'none',
                      fontWeight: 'bold'
                    }}>
                      {getPieceSymbol(piece)}
                    </span>
                  )}
                </Box>
              );
            })
          )}
          
          {/* Coordinates */}
          {showCoordinates && (
            <>
              {/* File labels (a-h) */}
              {files.map((file, index) => (
                <Typography
                  key={`file-${file}`}
                  level="body-xs"
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    left: index * squareSize + squareSize / 2,
                    transform: 'translateX(-50%)',
                    color: index % 2 === 0 ? '#b58863' : '#f0d9b5',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    userSelect: 'none',
                  }}
                >
                  {file}
                </Typography>
              ))}
              
              {/* Rank labels (1-8) */}
              {ranks.map((rank, index) => (
                <Typography
                  key={`rank-${rank}`}
                  level="body-xs"
                  sx={{
                    position: 'absolute',
                    left: 4,
                    top: index * squareSize + 4,
                    color: index % 2 === 0 ? '#f0d9b5' : '#b58863',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    userSelect: 'none',
                  }}
                >
                  {rank}
                </Typography>
              ))}
            </>
          )}
        </Box>
      </Card>
      
      {caption && (
        <Typography level="body-sm" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
          {caption}
        </Typography>
      )}
      
      {hoveredSquare && (
        <Typography level="body-xs" sx={{ mt: 1, color: 'text.tertiary' }}>
          Square: {hoveredSquare} {board[hoveredSquare] && `(${isWhitePiece(board[hoveredSquare]) ? 'White' : 'Black'} ${getPieceSymbol(board[hoveredSquare])})`}
        </Typography>
      )}
    </Box>
  );
};
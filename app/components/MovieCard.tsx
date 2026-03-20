"use client";

import Link from "next/link";
import Image from "next/image";
import { generateMovieUrl } from "@/lib/slug";
import { resolvePosterUrl } from "@/lib/poster";

interface MovieCardProps {
  movie: {
    imdbId: string;
    imdb_id: string;
    title: string;
    year: number;
    poster_path: string;
    vote_average: number;
    overview?: string;
    release_date?: string;
    runtime?: number;
  };
  index: number;
}

export default function MovieCard({ movie, index }: MovieCardProps) {
  return (
    <Link
      key={`${movie.imdb_id}-${index}`}
      href={generateMovieUrl(movie.title, movie.imdb_id)}
      className="group relative"
    >
      <div className="relative aspect-[2/3] bg-gray-800 rounded overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
        <Image
          src={resolvePosterUrl(movie.poster_path, "w500")}
          alt={`${movie.title} movie poster`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 12.5vw"
          priority={index < 8} // Prioritize first 8 images, no loading="lazy" needed
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {/* Rating Badge */}
        {movie.vote_average && movie.vote_average > 0 && (
          <div className="absolute top-0.5 right-0.5 bg-yellow-500 text-black text-xs font-bold px-1 py-0.5 rounded">
            {movie.vote_average.toFixed(1)}
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 hover:scale-110 transition-all duration-200">
            <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* Movie Info Overlay on Hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {movie.runtime && (
            <p className="text-xs text-gray-300">
              {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
            </p>
          )}
        </div>
      </div>
      
      {/* Title below poster */}
      <h3 className="text-white text-xs mt-1 line-clamp-1 group-hover:text-green-400 transition-colors">
        {movie.title}
      </h3>
      <p className="text-gray-400 text-xs">
        {movie.year}
      </p>
      {movie.vote_average && movie.vote_average > 0 && (
        <div className="flex items-center space-x-1 mt-1">
          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span className="text-xs text-gray-400">{movie.vote_average.toFixed(1)}</span>
        </div>
      )}
    </Link>
  );
}

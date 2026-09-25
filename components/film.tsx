"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Film as FilmData } from "@/content/projects";

function formatTime(seconds: number) {
  const wholeSeconds = Math.floor(seconds);
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, "0")}`;
}

export function Film({
  film,
  name,
  priority = false,
  failureHint,
}: {
  film: FilmData;
  name: string;
  priority?: boolean;
  failureHint: string;
}) {
  const id = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<string | null>(null);
  const [portrait, setPortrait] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Playing one film pauses any other film on the page.
    const pauseOther = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== id) videoRef.current?.pause();
    };
    window.addEventListener("film:play", pauseOther);
    return () => window.removeEventListener("film:play", pauseOther);
  }, [id]);

  const fail = useCallback(() => {
    videoRef.current?.pause();
    setSource(null);
    setPortrait(false);
    setFailed(true);
  }, []);

  async function play() {
    const usePortrait = window.matchMedia("(max-width: 767px) and (orientation: portrait)").matches;
    setFailed(false);
    setPortrait(usePortrait);
    setSource(usePortrait ? film.portrait : film.landscape);
    window.dispatchEvent(new CustomEvent("film:play", { detail: id }));
  }

  const ready = useCallback((video: HTMLVideoElement | null) => {
    videoRef.current = video;
    if (!video) return;
    video.focus();
    void video.play().catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === "NotAllowedError")) fail();
    });
  }, [fail]);

  return (
    <figure className="film">
      <div className="film__frame" data-orientation={portrait ? "portrait" : "landscape"}>
        <picture>
          <source type="image/avif" srcSet={`${film.poster}.avif`} />
          <source type="image/webp" srcSet={`${film.poster}.webp`} />
          <img
            className="film__poster"
            src={`${film.poster}.jpg`}
            alt=""
            width={1280}
            height={720}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
          />
        </picture>
        {/* A video element is created only after a click, so it makes no media request on load. */}
        {source ? (
          <video
            ref={ready}
            className="film__video"
            src={source}
            poster={`${film.poster}.jpg`}
            controls
            playsInline
            preload="auto"
            onError={fail}
            onPlay={() => window.dispatchEvent(new CustomEvent("film:play", { detail: id }))}
            onLoadedData={(event) => event.currentTarget.classList.add("film__video--ready")}
          >
            <track kind="descriptions" src={film.descriptions} srcLang="en" label="Description" />
          </video>
        ) : (
          <button
            type="button"
            className="film__play"
            aria-label={`Play the ${name} film, ${film.seconds} seconds`}
            onClick={play}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 3.5v17l14-8.5z" />
            </svg>
            Play film <span className="film__time">{formatTime(film.seconds)}</span>
          </button>
        )}
      </div>
      <figcaption className="film__note">{film.note}</figcaption>
      {failed && <p className="film__error" role="status">The film couldn&apos;t load. {failureHint}</p>}
    </figure>
  );
}

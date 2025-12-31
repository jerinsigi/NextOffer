
import React from "react";
import { motion } from "framer-motion";

function FloatingPaths({ position }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position
            } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position
            } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position
            } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="position-absolute top-0 start-0 w-100 h-100 pe-none">
            <svg
                className="w-100 h-100 text-slate-950"
                viewBox="0 0 696 316"
                fill="none"
                style={{ color: 'var(--bs-body-color)' }}
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.03}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    title = "Background Paths",
}) {
    const words = title.split(" ");

    return (
        <div className="position-relative min-vh-100 w-100 d-flex align-items-center justify-content-center overflow-hidden bg-white dark-bg-neutral-950">
            <div className="position-absolute top-0 start-0 w-100 h-100">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <div className="position-relative z-1 container px-4 px-md-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="mx-auto"
                    style={{ maxWidth: '896px' }} // max-w-4xl
                >
                    <h1 className="display-1 fw-bold mb-5 tracking-tighter">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="d-inline-block me-4 last-me-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="d-inline-block text-transparent bg-clip-text bg-gradient-primary"
                                        style={{
                                            backgroundImage: 'linear-gradient(to right, #000, #333)', // adapt for dark mode if needed
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text'
                                        }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    <div
                        className="d-inline-block position-relative rounded-4 overflow-hidden shadow-lg transition-shadow duration-300"
                        style={{
                            padding: '1px',
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(255,255,255,0.1))',
                            backdropFilter: 'blur(16px)'
                        }}
                    >
                        <button
                            className="btn btn-link text-decoration-none rounded-4 px-5 py-4 fs-5 fw-semibold border border-opacity-10 transition-all duration-300"
                            style={{
                                background: 'rgba(255,255,255,0.95)',
                                color: '#000',
                                backdropFilter: 'blur(12px)'
                            }}
                        >
                            <span className="opacity-90">
                                Discover Excellence
                            </span>
                            <span
                                className="ms-3 opacity-70 transition-all duration-300"
                            >
                                →
                            </span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default BackgroundPaths;

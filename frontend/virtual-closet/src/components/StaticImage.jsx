function StaticImage({ src, alt, position, size }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`
      }}
    />
  );
}
export default StaticImage
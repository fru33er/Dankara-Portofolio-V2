interface RollTextProps {
  text: string;
}

export function RollText({ text }: RollTextProps) {
  return (
    <span className="roll-text">
      <span className="roll-text-layer">{text}</span>
      <span className="roll-text-layer" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}

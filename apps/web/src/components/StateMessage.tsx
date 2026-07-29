type StateMessageProps = {
  title: string;
  message: string;
};

export function StateMessage({ title, message }: StateMessageProps) {
  return (
    <section className="state-message" role="status">
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}

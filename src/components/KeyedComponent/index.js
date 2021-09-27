export const KeyedComponent = (Component) => (props, index) => {
  const key = props?.id ?? index;
  return <Component {...props} key={key} />;
};

export default KeyedComponent;

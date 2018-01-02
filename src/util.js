import createUUID from 'uuid';

export const uuid = process.env.NODE_ENV === 'test' ? () => '$uuid$' : createUUID;

export function handleBinder(props) {
  let newProps = {};
  ['error', 'label', 'value', 'onBlur'].forEach(method => {
    let binder = props[`${method}Binder`];
    if (!binder) return;
    if (typeof binder[`${method}For`] === 'function') newProps[method] = binder[`${method}For`](props.id);
    else if (typeof binder[`${method}Props`] === 'function') binder[`${method}Props`](props, newProps);
  });
  return newProps;
}

export function inputChange(e, action) {
  if (e.target) {
    const { value, id } = {
      value: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
      id: e.target.id,
    };
    action(e.target, id, value, null);
  } else {
    const { value, valueFile, id } = {
      value: e.type === 'fileinput' ? (e.value ? e.value.file.name : null) : e.value,
      valueFile: e.type === 'fileinput' ? e.value : null,
      id: e.id,
    };
    action(e, id, value, valueFile);
  }
}

export function convertDataURIToBinary(dataURI) {
  const BASE64_MARKER = ';base64,';
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));
  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

export function convertDataURIToString(dataURI) {
  const data = convertDataURIToBinary(dataURI);
  const string = String.fromCharCode.apply(null, data);
  return string;
}

export default {
  uuid, handleBinder,
  inputChange,
  convertDataURIToBinary,
  convertDataURIToString,
};

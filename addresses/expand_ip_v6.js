const delimiter = ':';
const groupsCount = 8;
const isGroup = n => /^[0-9a-fA-F]{1,4}$/.test(n);
const paddedGroup = n => n.toLowerCase().padStart(4, '0');
const zeroCompression = '::';
const zeroGroup = '0';

/** Expand an ip v6 hostname into fully padded groups

  {
    hostname: <Ip V6 Hostname String>
  }

  @returns
  {
    [groups]: [<Padded Ip V6 Group Hex String>]
  }
*/
module.exports = ({hostname}) => {
  const [start, end, extra] = hostname.split(zeroCompression);

  // Exit early when there is more than one zero compression marker
  if (extra !== undefined) {
    return {};
  }

  // Exit early when there is no zero compression to expand
  if (end === undefined) {
    const groups = start.split(delimiter);

    if (groups.length !== groupsCount || !groups.every(isGroup)) {
      return {};
    }

    return {groups: groups.map(paddedGroup)};
  }

  const head = !start ? [] : start.split(delimiter);
  const tail = !end ? [] : end.split(delimiter);

  const known = [].concat(head).concat(tail);

  // A :: fills in missing zero groups, so some groups must be missing
  if (known.length >= groupsCount) {
    return {};
  }

  // Exit early when a group is not a short hex value
  if (!known.every(isGroup)) {
    return {};
  }

  const zeros = Array(groupsCount - known.length).fill(zeroGroup);

  const groups = [].concat(head).concat(zeros).concat(tail);

  return {groups: groups.map(paddedGroup)};
};

export function buildTree(folders) {
  const map = new Map();
  const roots = [];

  folders.forEach((folder) => {
    map.set(folder._id, { ...folder, children: [] });
  });

  folders.forEach((folder) => {
    if (folder.parentId === null) {
      // 如果 folder 没有 parentId，则它是一个根节点
      roots.push(map.get(folder._id));
    } else {
      // 否则，将其添加到其父节点的 children 数组中
      const parent = map.get(folder.parentId);
      if (parent) {
        parent.children.push(map.get(folder._id));
      }
    }
  });
  console.log(roots);
  return roots;
}

// 一个平铺的数组处理为一个树状结构 每个节点有基础的id、parentId字段
const arr = [
    {
        id: "1",
        parentId: "0",
    },
    {
        id: "1-1",
        parentId: "1",
    },
    {
        id: "2-1",
        parentId: "2",
    },
    {
        id: "2",
        parentId: "0",
    },
    {
        id: "2-1-1",
        parentId: "2-1",
    },
];

// 递归法。构造树结构的关键在于找到一个节点的所有子节点和子节点的子节点，如此递归下去。
// 每次递归函数返回一个节点的子节点列表，赋值在该节点的children属性上。
function constructTree(list, rootId) {
    return list.reduce((accu, item) => {
        if (item.parentId === rootId) {
            const children = constructTree(list, item.id);

            item.children = children;

            return [...accu, item];
        }

        return accu;
    }, []);
}

constructTree(arr, "0");

// 非递归法。递归法每次在找一个节点的子节点时都会重新遍历所有给定数组。
// 数据量很大时这是有性能问题的。尝试减少它的复杂度
// 目标是只需要遍历一次数组，因为遍历一次，所以遍历过的元素我们没法再获取到，所以需要缓存上，
// 这里我们使用对象key为id，value为节点值的方法缓存。
// 每一步都需要在缓存对象上寻找当前节点的父节点是否已存在，存在则将当前节点push进children，不存在则建立父节点
// 将节点放入所属父节点时需要使用缓存中的对象而不是当前遍历到的。引用关系!!!
function constructTreeNonRecursion(arr, rootId) {
    const res = {
        [rootId]: { id: rootId, children: [] },
    };
    arr.forEach((item) => {
        if (!res[item.id]) {
            res[item.id] = item;
        } else {
            res[item.id] = { ...item, ...res[item.id] };
        }

        if (res[item.parentId]) {
            if (!res[item.parentId].children) {
                res[item.parentId].children = [];
            }
            res[item.parentId].children.push(res[item.id]);
        } else {
            res[item.parentId] = {
                children: [res[item.id]],
            };
        }
    });

    return res[rootId];
}

constructTreeNonRecursion(arr, "0");

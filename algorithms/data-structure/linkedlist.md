# 链表

# 概念

链表是一种动态的数据结构，这就意味着我们可以从中任意添加和移除元素，他也可以按需扩容。

链表存储有序的元素集合，但不同于数组，链表中的元素在内存中并不是连续放置的。每个 元素由一个存储元素本身的节点和一个指向下一个元素的引用(也称指针或链接)组成。

相对于传统的数组，链表的一个好处在于，添加或移除元素的时候不需要移动其他元素。然 而，链表需要使用指针，因此实现链表时需要额外注意。数组的另一个细节是可以直接访问任何 位置的任何元素，而要想访问链表中间的一个元素，需要从起点(表头)开始迭代列表直到找到 所需的元素。

## 代码实现

```js
// 抽象出每个节点的特性
function Node(element) {
    this.element = element;
    this.next = null;
}

function createLinkedList() {
    // 一个链表的基本属性有 length head
    let head = null;
    // 链表的长度
    let length = 0;

    return {
        // 在链表尾部新增一个节点
        append: function (element) {
            const node = new Node(element);

            // 如果没有head，那就是head
            if (!head) {
                head = node;
            } else {
                // 如果有head，那就是从头开始找
                // 定义cur保存遍历中的当前元素
                let cur = head;

                while (cur.next) {
                    cur = cur.next;
                }
                // 遍历结束就node赋在cur的next上
                cur.next = node;
            }

            length += 1;
        },
        // 在对应节点后插入一个节点
        insert: function (position, element) {
            if (position > -1 && position <= length) {
                const node = new Node(element);

                if (position === 0) {
                    head = node;
                } else {
                    let index = 0;
                    let cur = head;

                    // 保存前一个节点 因为要设置前一个节点的next为新的
                    let previous = cur;

                    while (index < position) {
                        previous = cur;
                        cur = cur.next;
                        index++;
                    }

                    // 循环结束
                    previous.next = node;
                    node.next = cur;
                }
            }
        },
        // 移除指定节点  也就是将指定节点去掉后，将去掉节点的前一个的next指向去掉节点的后一个
        removeAt: function (position) {
            if (position > -1 && position < length) {
                let cur = head;
                let previous = cur;
                let index = 0;

                // 移除第一项的就是把head去掉，将第二项作为head
                if (position === 0) {
                    head = cur.next;
                } else {
                    while (index < position) {
                        previous = cur;
                        cur = cur.next;
                    }

                    previous.next = cur.next;
                }

                length -= 1;
            }
        },
        // 移除指定元素
        remove: function (element) {
            const destIndex = this.indexOf(element)

            return this.removeAt(destIndex);
        },
        // 查找给定元素的索引
        indexOf: function (element) {
            let cur = head;
            let index = 0;

            while (cur) {
                if (cur.element === element) {
                    return index;
                }

                index++;
                cur = cur.next;
            }

            return -1;
        },
        size: function () {
            return length;
        },
        isEmpty: function () {
            return length === 0;
        };
        getHead: function () {
            return head;
        },
    };
}
```

```js
// 双向链表
// 抽象出每个节点的特性
function Node(element) {
    this.element = element;
    this.next = null;
    this.prev = null;
}

function createDoubleDirecLinkList() {
    let length = 0;
    let head = null;
    let tail = null;

    function append(element) {
        const node = new Node(element);

        if (length === 0) {
            head = node;
        } else {
            cur = head;

            while (cur.next) {
                cur = cur.next;
            }

            cur.next = node;
            node.prev = cur;
        }

        length += 1;
    }

    function insert(position, element) {
        if (position > -1 && position <= length) {
            let node = new Node(element);
            let cur = head;
            let previous;
            let index = 0;

            if (position === 0) {
                if (!head) {
                    head = node;
                    tail = node;
                } else {
                    node.next = cur;
                    cur.prev = node;
                    head = node;
                }
            } else if (position === length) {
                cur = tail;
                cur.next = node;
                node.prev = cur;
                tail = node;
            } else {
                while (index < position) {
                    previous = cur;
                    cur = cur.next;
                    index++;
                }
                node.next = cur;
                previous.next = node;

                cur.prev = node;
                node.prev = previous;
            }

            length += 1;
        }
    }

    function remove(element) {
        var index = this.indexOf(element);
        return this.removeAt(index);
    }

    function removeAt(position) {
        this.removeAt = function (position) {
            if (position > -1 && position < length) {
                var current = head,
                    previous,
                    index = 0;
                //移除第一项
                if (position === 0) {
                    head = current.next;
                    if (length === 1) {
                        tail = null;
                    } else {
                        head.prev = null;
                    }
                } else if (position === length - 1) {
                    current = tail;
                    tail = current.prev;
                    tail.next = null;
                } else {
                    while (index++ < position) {
                        previous = current;
                        current = current.next;
                    }
                    previous.next = current.next;
                    current.next.prev = previous;
                }
                length -= 1;
                return current.element;
            } else {
                return null;
            }
        };
    }

    function indexOf(element) {}

    function size(element) {}

    function getHead(element) {}

    return { append, remove, removeAt, insert, indexOf, size, getHead };
}
```

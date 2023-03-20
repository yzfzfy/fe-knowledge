## 虚拟滚动

大量数据情况下，不一次性展示全部而是只展示视野范围内的数据。记录简易实现代码逻辑。

这里只讨论数据中每一项的高度相同的情况。

### 大致逻辑

1. 获取当前可视区的高度。viewHeight
2. 计算一屏可以展示的数据条数、也就是最终我们需要动态修改数据的条数。length = Math.ceil(viewHeight/itemheight)
3. 首次加载时截取索引 0 到 length 的数据并展示
4. 监听滚动事件，动态改变数据

### react 组件逻辑实现

```jsx
function VirtualScroll(data, itemHeight) {
    const containerRef = useRef();
    const [startIndex, setStartIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const viewHeight = containerRef.current.clientHeight;
        const visibleCount = Math.ceil(viewHeight / itemHeight);

        setVisibleList(data.slice(startIndex, numAveragePage));
        setVisibleCount(visibleCount);
    }, []);

    function handleScroll(e) {
        const scrollTop = e.currentTarget.scrollTop;

        // 根据滚动距离算出影响单项的条数
        const startIndex = Math.ceil(scrollTop / itemHeight);

        setStartIndex(startIndex);
    }

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
        >
            {data.slice(startIndex, numAveragePage).map((item) => ReactElement)}
        </div>
    );
}
```

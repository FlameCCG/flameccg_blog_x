import asyncio

async def async_task():
    print("Async task start")
    await asyncio.sleep(2)  # 非阻塞等待
    print("Async task end")

async def main():
    task = asyncio.create_task(async_task())
    print("Main doing other things...")
    await task

asyncio.run(main())

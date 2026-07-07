using System.Text.Json;

namespace PharmacyApi.Infrastructure;

// Reads/writes a list of T to a JSON file. A lock keeps concurrent
// requests from corrupting the file.
public class JsonFileStore<T>
{
    private readonly string _filePath;
    private readonly object _lock = new();

    private static readonly JsonSerializerOptions Options = new()
    {
        WriteIndented = true,
        PropertyNameCaseInsensitive = true
    };

    public JsonFileStore(string fileName)
    {
        var dataFolder = Path.Combine(AppContext.BaseDirectory, "Data");
        Directory.CreateDirectory(dataFolder);
        _filePath = Path.Combine(dataFolder, fileName);
    }

    public List<T> ReadAll()
    {
        lock (_lock)
        {
            if (!File.Exists(_filePath)) return new List<T>();
            var json = File.ReadAllText(_filePath);
            if (string.IsNullOrWhiteSpace(json)) return new List<T>();
            return JsonSerializer.Deserialize<List<T>>(json, Options) ?? new List<T>();
        }
    }

    public void WriteAll(List<T> items)
    {
        lock (_lock)
        {
            File.WriteAllText(_filePath, JsonSerializer.Serialize(items, Options));
        }
    }
}

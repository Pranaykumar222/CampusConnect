import { useEffect, useState } from "react"
import connectionService from "../../services/api/connectionService"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Avatar from "../../components/ui/Avatar"
import Tabs from "../../components/ui/Tabs"
import { toast } from "react-hot-toast"

const TABS = ["Pending Requests", "My Connections"]

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState("Pending Requests")
  const [pending, setPending] = useState([])
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const [pendingRes, connectionsRes] = await Promise.all([
        connectionService.getPendingRequests(),
        connectionService.getMyConnections(),
      ])

      setPending(pendingRes.data.requests || [])
      setConnections(connectionsRes.data.connections || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = async (id, action) => {
    try {
      await connectionService.respond(id, action)
      toast.success(`Request ${action}ed`)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed")
    }
  }

  const handleRemove = async (id) => {
    try {
      await connectionService.remove(id)
      toast.success("Connection removed")
      fetchData()
    } catch (err) {
      toast.error("Failed")
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Connections
        </h1>
        <p className="text-neutral-500">
          Manage your connection requests and network.
        </p>
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {loading && <p className="text-neutral-500">Loading...</p>}

    
      {activeTab === "Pending Requests" && (
        <div className="space-y-4">
          {pending.length === 0 ? (
            <p className="text-neutral-500">
              No pending requests.
            </p>
          ) : (
            pending.map((req) => (
              <Card key={req._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar
                      name={`${req.requester.firstName} ${req.requester.lastName}`}
                      src={req.requester.avatar}
                      size="lg"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {req.requester.firstName} {req.requester.lastName}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {req.requester.major} • {req.requester.university}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleRespond(req._id, "accept")
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleRespond(req._id, "reject")
                      }
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

  
      {activeTab === "My Connections" && (
        <div className="space-y-4">
          {connections.length === 0 ? (
            <p className="text-neutral-500">
              No connections yet.
            </p>
          ) : (
            connections.map((conn) => {
              const user =
                conn.requester._id === conn.receiver._id
                  ? conn.receiver
                  : conn.requester

              return (
                <Card key={conn._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar
                        name={`${user.firstName} ${user.lastName}`}
                        src={user.avatar}
                        size="lg"
                      />
                      <div>
                        <h3 className="font-semibold">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          {user.major} • {user.university}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemove(conn._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

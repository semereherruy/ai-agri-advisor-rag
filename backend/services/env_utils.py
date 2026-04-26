"""Utility functions for environment variable handling."""

import os
from typing import Any

def get_env_var(name: str, default: Any = None, required: bool = False) -> Any:
    """Retrieve an environment variable.

    Args:
        name: Name of the environment variable.
        default: Value to return if variable is not set.
        required: If True and variable is missing, raises RuntimeError.

    Returns:
        The environment variable value (as a string) or the default.

    Raises:
        RuntimeError: If required is True and the variable is not set.
    """
    value = os.getenv(name, default)
    if required and value is None:
        raise RuntimeError(f"❌ Environment variable '{name}' is required but not set.")
    return value